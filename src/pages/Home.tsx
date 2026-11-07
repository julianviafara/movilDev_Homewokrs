import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonChip, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonPage, IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { locateOutline, navigateOutline, radioOutline, searchOutline, walkOutline } from 'ionicons/icons';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { Network, type ConnectionStatus } from '@capacitor/network';
import { Haptics } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';
import 'leaflet/dist/leaflet.css';
import './Home.css';

type Coordinates = { lat: number; lng: number };
type NearbyPlace = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
};

const OPENCAGE_KEY = import.meta.env.VITE_OPENCAGE_API_KEY as string | undefined;
const DEFAULT_CENTER: Coordinates = { lat: 3.4516, lng: -76.5320 }; // Cali, Colombia
const DEFAULT_ZOOM = 15;

const isValidCoordinates = (coords: Coordinates) =>
  Number.isFinite(coords.lat) &&
  Number.isFinite(coords.lng) &&
  coords.lat >= -90 &&
  coords.lat <= 90 &&
  coords.lng >= -180 &&
  coords.lng <= 180;

function parseCoordinates(lat: unknown, lng: unknown): Coordinates | null {
  const coords = { lat: Number(lat), lng: Number(lng) };
  return isValidCoordinates(coords) ? coords : null;
}

function RecenterMap({ center }: { center: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    const applyView = () => {
      map.invalidateSize();
      if (!isValidCoordinates(center)) return;
      const size = map.getSize();
      if (!size.x || !size.y) return;
      map.setView([center.lat, center.lng], Math.max(map.getZoom() || DEFAULT_ZOOM, DEFAULT_ZOOM), {
        animate: false,
      });
    };

    applyView();
    const timeoutId = window.setTimeout(applyView, 250);
    return () => window.clearTimeout(timeoutId);
  }, [center.lat, center.lng, map]);

  return null;
}

function distanceMeters(a: Coordinates, b: Coordinates) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const earth = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export default function Home() {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState('Waiting for your location…');
  const [network, setNetwork] = useState<ConnectionStatus>({ connected: false, connectionType: 'none' });
  const [tracking, setTracking] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [placeQuery, setPlaceQuery] = useState('restaurant');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [message, setMessage] = useState('Allow location access to center the map.');
  const [path, setPath] = useState<Coordinates[]>([]);
  const watchId = useRef<string | null>(null);
  const motionHandle = useRef<PluginListenerHandle | null>(null);
  const stillTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackingRef = useRef(false);
  const autoModeRef = useRef(false);

  useEffect(() => { trackingRef.current = tracking; }, [tracking]);
  useEffect(() => { autoModeRef.current = autoMode; }, [autoMode]);

  const reverseGeocode = useCallback(async (coords: Coordinates) => {
    if (!OPENCAGE_KEY) {
      setAddress(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (add your OpenCage API key)`);
      return;
    }
    try {
      const url = new URL('https://api.opencagedata.com/geocode/v1/json');
      url.searchParams.set('q', `${coords.lat},${coords.lng}`);
      url.searchParams.set('key', OPENCAGE_KEY);
      url.searchParams.set('language', 'es');
      url.searchParams.set('no_annotations', '1');
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`OpenCage returned ${response.status}`);
      const data = await response.json();
      setAddress(data.results?.[0]?.formatted ?? 'Address not found for this location.');
    } catch (error) {
      console.error(error);
      setAddress('Could not retrieve the address. Check your connection/API key.');
    }
  }, []);

  const updatePosition = useCallback((coords: Coordinates) => {
    const parsed = parseCoordinates(coords.lat, coords.lng);
    if (!parsed) {
      console.warn('Invalid GPS coordinates:', coords);
      setMessage('GPS returned invalid coordinates. Using default map location.');
      return;
    }

    setPosition(parsed);
    void reverseGeocode(parsed);
  }, [reverseGeocode]);

  const getCurrentLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const status = await Network.getStatus();
      setNetwork(status);
      if (!status.connected) {
        setMessage('No internet connection. GPS may still work, but the address and places need internet.');
      }
      const result: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000,
      });
      const coords = parseCoordinates(result.coords.latitude, result.coords.longitude);
      if (!coords) {
        setMessage('GPS returned invalid coordinates. Using default map location.');
        return;
      }
      updatePosition(coords);
      setMessage('Your current location is ready.');
    } catch (error) {
      console.error(error);
      setMessage('Could not get location. Enable GPS/location permission and try again.');
    } finally {
      setLoadingLocation(false);
    }
  }, [updatePosition]);

  const stopTracking = useCallback(async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    trackingRef.current = false;
    setTracking(false);
    setMessage('Tracking stopped.');
  }, []);

  const startTracking = useCallback(async (fromMotion = false) => {
    if (trackingRef.current) return;
    try {
      const status = await Network.getStatus();
      setNetwork(status);
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 },
        (result, error) => {
          if (error) {
            console.error(error);
            setMessage('Location tracking error. Check GPS permission.');
            return;
          }
          if (!result) return;
          const coords = parseCoordinates(result.coords.latitude, result.coords.longitude);
          if (!coords) return;
          updatePosition(coords);
          setPath((old) => [...old, coords]);
        },
      );
      watchId.current = id;
      trackingRef.current = true;
      setTracking(true);
      setPath((old) => old.length ? old : position ? [position] : []);
      await Haptics.vibrate({ duration: 450 });
      setMessage(fromMotion ? 'Movement detected — tracking started.' : 'Tracking started. Your route is being recorded on screen.');
    } catch (error) {
      console.error(error);
      setMessage('Could not start tracking. Check location permission and GPS.');
    }
  }, [position, updatePosition]);

  const searchNearby = useCallback(async () => {
    if (!position) {
      setMessage('Get your current location before searching for nearby places.');
      return;
    }
    if (!OPENCAGE_KEY) {
      setMessage('Add VITE_OPENCAGE_API_KEY to your .env file to use OpenCage search.');
      return;
    }
    if (!network.connected) {
      setMessage('Connect to the internet before searching nearby places.');
      return;
    }
    setLoadingPlaces(true);
    try {
      // OpenCage forward geocoding supports proximity bias. This searches for
      // matching named places and ranks the results around the current location.
      const url = new URL('https://api.opencagedata.com/geocode/v1/json');
      url.searchParams.set('q', placeQuery.trim() || 'restaurant');
      url.searchParams.set('key', OPENCAGE_KEY);
      url.searchParams.set('proximity', `${position.lat},${position.lng}`);
      url.searchParams.set('limit', '8');
      url.searchParams.set('no_annotations', '1');
      url.searchParams.set('language', 'es');
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`OpenCage returned ${response.status}`);
      const data = await response.json();
      const results: NearbyPlace[] = (data.results ?? []).map((item: any) => {
        const coords = parseCoordinates(item.geometry?.lat, item.geometry?.lng);
        if (!coords) return null;
        return {
          name: item.components?.name || item.formatted?.split(',')[0] || 'Place',
          address: item.formatted || 'Address unavailable',
          lat: coords.lat,
          lng: coords.lng,
          category: item.components?._category || 'place',
        } as NearbyPlace;
      }).filter((item: NearbyPlace | null): item is NearbyPlace => item !== null)
        .sort((a: NearbyPlace, b: NearbyPlace) =>
          distanceMeters(position, a) - distanceMeters(position, b));
      setPlaces(results);
      setMessage(results.length ? `Found ${results.length} matching places near you.` : 'No matching places were returned. Try another search term.');
    } catch (error) {
      console.error(error);
      setMessage('Nearby search failed. Check your OpenCage key and internet connection.');
    } finally {
      setLoadingPlaces(false);
    }
  }, [network.connected, placeQuery, position]);

  const enableMotionDetection = useCallback(async () => {
    try {
      // iOS 13+ requires motion permission from a user action. Android normally does not.
      const motionEvent = DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof motionEvent.requestPermission === 'function') {
        const permission = await motionEvent.requestPermission();
        if (permission !== 'granted') {
          setMessage('Motion permission was not granted.');
          return;
        }
      }
      if (motionHandle.current) await motionHandle.current.remove();
      motionHandle.current = await Motion.addListener('accel', (event) => {
        const acceleration = event.acceleration ?? event.accelerationIncludingGravity;
        if (!acceleration) return;
        const magnitude = Math.sqrt(
          (acceleration.x ?? 0) ** 2 +
          (acceleration.y ?? 0) ** 2 +
          (acceleration.z ?? 0) ** 2,
        );
        // When accelerationIncludingGravity is used, subtract the 1g baseline.
        const movement = event.acceleration ? magnitude : Math.abs(magnitude - 9.81);
        if (movement > 2.0) {
          if (stillTimer.current) clearTimeout(stillTimer.current);
          if (autoModeRef.current && !trackingRef.current) void startTracking(true);
        } else if (autoModeRef.current && trackingRef.current) {
          if (stillTimer.current) clearTimeout(stillTimer.current);
          stillTimer.current = setTimeout(() => {
            if (autoModeRef.current && trackingRef.current) void stopTracking();
          }, 15000);
        }
      });
      setAutoMode(true);
      autoModeRef.current = true;
      setMessage('Automatic mode enabled: movement starts tracking; 15 seconds still stops it.');
    } catch (error) {
      console.error(error);
      setMessage('Motion sensor unavailable. Try on your Android phone and allow sensor access.');
    }
  }, [startTracking, stopTracking]);

  const disableMotionDetection = useCallback(async () => {
    if (motionHandle.current) {
      await motionHandle.current.remove();
      motionHandle.current = null;
    }
    if (stillTimer.current) clearTimeout(stillTimer.current);
    autoModeRef.current = false;
    setAutoMode(false);
    setMessage('Automatic movement detection disabled.');
  }, []);

  useEffect(() => {
    let networkHandle: PluginListenerHandle | undefined;
    void Network.getStatus().then(setNetwork).catch(console.error);
    void Network.addListener('networkStatusChange', setNetwork).then((handle) => {
      networkHandle = handle;
    });
    void getCurrentLocation();
    return () => {
      if (networkHandle) void networkHandle.remove();
      if (watchId.current) void Geolocation.clearWatch({ id: watchId.current });
      if (motionHandle.current) void motionHandle.current.remove();
      if (stillTimer.current) clearTimeout(stillTimer.current);
    };
  }, [getCurrentLocation]);

  const mapCenter =
    position && isValidCoordinates(position)
      ? position
      : DEFAULT_CENTER;
  const validPath = path.filter(isValidCoordinates);
  const validPlaces = places.filter((place) => isValidCoordinates(place));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>My Maps Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="map-content">
        <div className="dashboard">
          <div className="topline">
            <div>
              <p className="eyebrow">CHALLENGE 08</p>
              <h1>Explore around you</h1>
              <p className="subheading">Your location, movement and nearby places.</p>
            </div>
            <IonChip color={network.connected ? 'success' : 'danger'}>
              <IonIcon icon={radioOutline} />
              <IonLabel>{network.connected ? network.connectionType.toUpperCase() : 'OFFLINE'}</IonLabel>
            </IonChip>
          </div>

          <IonCard className="map-card">
            <IonCardContent className="map-wrapper">
              <MapContainer
                center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom
                className="leaflet-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap center={mapCenter} />
                {position && isValidCoordinates(position) && (
                  <CircleMarker center={[position.lat, position.lng]} radius={9} pathOptions={{ color: '#00c389', fillColor: '#00c389', fillOpacity: 0.9 }}>
                    <Popup>You are here</Popup>
                  </CircleMarker>
                )}
                {validPath.length > 1 && (
                  <Polyline
                    positions={validPath.map((point) => [point.lat, point.lng] as [number, number])}
                    pathOptions={{ color: '#00c389', weight: 5 }}
                  />
                )}
                {validPlaces.map((place, index) => (
                  <CircleMarker key={`${place.lat}-${place.lng}-${index}`} center={[place.lat, place.lng]} radius={7} pathOptions={{ color: '#f5b942', fillColor: '#f5b942', fillOpacity: 0.9 }}>
                    <Popup><strong>{place.name}</strong><br />{place.address}</Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
              <div className="map-overlay">
                <IonButton size="small" color="light" onClick={getCurrentLocation} disabled={loadingLocation}>
                  {loadingLocation ? <IonSpinner name="dots" /> : <IonIcon icon={locateOutline} slot="start" />}
                  My location
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="info-card">
            <IonCardContent>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">CURRENT LOCATION</p>
                  <h2>Where am I?</h2>
                </div>
                <span className={`status-dot ${position ? 'active' : ''}`} />
              </div>
              <p className="address">{address}</p>
              <p className="coordinates">
                {position ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}` : 'Waiting for GPS coordinates'}
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="info-card">
            <IonCardHeader>
              <IonCardTitle>Movement tracking</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="tracking-status">
                <IonChip color={tracking ? 'success' : 'medium'}>{tracking ? 'TRACKING' : 'STOPPED'}</IonChip>
                <IonText color="medium"><small>{path.length} route points</small></IonText>
              </div>
              <div className="button-row">
                <IonButton expand="block" onClick={() => void startTracking()} disabled={tracking}>
                  <IonIcon icon={navigateOutline} slot="start" /> Start
                </IonButton>
                <IonButton expand="block" color="medium" fill="outline" onClick={() => void stopTracking()} disabled={!tracking}>
                  Stop
                </IonButton>
              </div>
              <div className="button-row auto-row">
                <IonButton expand="block" color={autoMode ? 'success' : 'tertiary'} fill={autoMode ? 'solid' : 'outline'} onClick={() => autoMode ? void disableMotionDetection() : void enableMotionDetection()}>
                  <IonIcon icon={walkOutline} slot="start" />
                  {autoMode ? 'Disable auto mode' : 'Enable movement detection'}
                </IonButton>
              </div>
              <p className="helper">When automatic mode is enabled, movement starts tracking. If the phone stays still for 15 seconds, tracking stops. Starting tracking vibrates the phone.</p>
            </IonCardContent>
          </IonCard>

          <IonCard className="info-card">
            <IonCardHeader>
              <IonCardTitle>Nearby places</IonCardTitle>
              <p className="helper">Search places around your current position using OpenCage proximity.</p>
            </IonCardHeader>
            <IonCardContent>
              <IonItem className="search-input" lines="none">
                <IonInput value={placeQuery} placeholder="e.g. restaurant, pharmacy, cafe" onIonInput={(e) => setPlaceQuery(e.detail.value ?? '')} />
              </IonItem>
              <IonButton expand="block" onClick={() => void searchNearby()} disabled={loadingPlaces || !position}>
                {loadingPlaces ? <IonSpinner name="dots" /> : <IonIcon icon={searchOutline} slot="start" />}
                Search nearby
              </IonButton>
              {places.map((place, index) => (
                <div className="place-result" key={`${place.name}-${index}`}>
                  <div>
                    <strong>{place.name}</strong>
                    <p>{place.address}</p>
                    <small>{distanceMeters(position!, place).toFixed(0)} m away</small>
                  </div>
                </div>
              ))}
              {!places.length && <p className="helper">Search results will appear here and as markers on the map.</p>}
            </IonCardContent>
          </IonCard>

          <div className="message" role="status">{message}</div>
          <p className="footer-note">Map data © OpenStreetMap contributors · Address/search © OpenCage</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
