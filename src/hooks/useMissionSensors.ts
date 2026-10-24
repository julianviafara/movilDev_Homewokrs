import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { Haptics } from "@capacitor/haptics";
import { Motion } from "@capacitor/motion";
import type { PluginListenerHandle } from "@capacitor/core";
import { MOTION_THRESHOLD, MOVE_DISTANCE_M, STILL_SECONDS } from "../missions";

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function usePhotoMission(onComplete: () => void) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = useCallback(async () => {
    try {
      setError(null);
      const result = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: true,
      });
      if (result.webPath) setPhoto(result.webPath);
      onComplete();
    } catch (e: any) {
      if (!String(e?.message || e).toLowerCase().includes("cancel")) {
        setError("No se pudo tomar la foto");
      }
    }
  }, [onComplete]);

  return { photo, error, takePhoto };
}

export function useMovementMission(onComplete: () => void) {
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<string | null>(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const stop = useCallback(async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    setTracking(false);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      try {
        await Geolocation.requestPermissions();
      } catch {
      }
      const origin = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setDistance(0);
      setTracking(true);

      watchId.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (pos, err) => {
          if (err || !pos) return;
          const d = distanceMeters(
            origin.coords.latitude,
            origin.coords.longitude,
            pos.coords.latitude,
            pos.coords.longitude
          );
          setDistance(d);
          if (d >= MOVE_DISTANCE_M) {
            stop();
            doneRef.current();
          }
        }
      );
    } catch {
      setError("No se pudo obtener la ubicación");
      setTracking(false);
    }
  }, [stop]);

  useEffect(() => () => void stop(), [stop]);

  return { tracking, distance, error, start };
}

export function useStillnessMission(onComplete: () => void) {
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(STILL_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const handle = useRef<PluginListenerHandle | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMove = useRef(0);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const stop = useCallback(async () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (handle.current) {
      await handle.current.remove();
      handle.current = null;
    }
    setRunning(false);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      lastMove.current = Date.now();
      setSecondsLeft(STILL_SECONDS);

      handle.current = await Motion.addListener("accel", (e) => {
        const a = e.accelerationIncludingGravity;
        const magnitude = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
        if (Math.abs(magnitude - 9.81) > MOTION_THRESHOLD) {
          lastMove.current = Date.now();
        }
      });
      setRunning(true);

      timer.current = setInterval(async () => {
        const elapsed = (Date.now() - lastMove.current) / 1000;
        setSecondsLeft(Math.max(0, Math.ceil(STILL_SECONDS - elapsed)));
        if (elapsed >= STILL_SECONDS) {
          await stop();
          try {
            await Haptics.vibrate({ duration: 800 });
          } catch {
          }
          doneRef.current();
        }
      }, 200);
    } catch {
      setError("No se pudo acceder al acelerómetro");
      setRunning(false);
    }
  }, [stop]);

  useEffect(() => () => void stop(), [stop]);

  return { running, secondsLeft, error, start };
}
