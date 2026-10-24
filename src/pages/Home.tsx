import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  useMovementMission,
  usePhotoMission,
  useStillnessMission,
} from "../hooks/useMissionSensors";
import { MOVE_DISTANCE_M, STILL_SECONDS } from "../missions";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { missions, points, completedCount, total, percent, completeMission, logout, user } =
    useApp();

  const photo = usePhotoMission(() => completeMission(1));
  const move = useMovementMission(() => completeMission(2));
  const still = useStillnessMission(() => completeMission(3));

  const [m1, m2, m3] = missions;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hola, {user?.displayName || "jugador"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="summary">
          <div className="points">{points} pts</div>
          <IonProgressBar value={percent / 100} />
          <p className="muted">
            {percent}% · {completedCount}/{total} misiones completadas
          </p>
        </div>

        <IonCard className={m1.completed ? "done" : ""}>
          <IonCardHeader>
            <IonCardTitle>
              {m1.title} <IonBadge color={m1.completed ? "success" : "medium"}>{m1.completed ? "completada" : "pendiente"}</IonBadge>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{m1.description}</p>
            <p className="muted">{m1.points} puntos</p>
            {photo.photo && <img className="preview" src={photo.photo} alt="evidencia" />}
            {photo.error && <p className="error">{photo.error}</p>}
            {!m1.completed && (
              <IonButton onClick={photo.takePhoto}>Tomar foto</IonButton>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard className={m2.completed ? "done" : ""}>
          <IonCardHeader>
            <IonCardTitle>
              {m2.title} <IonBadge color={m2.completed ? "success" : "medium"}>{m2.completed ? "completada" : "pendiente"}</IonBadge>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{m2.description}</p>
            <p className="muted">{m2.points} puntos</p>
            {move.tracking && (
              <p>
                Distancia: {move.distance.toFixed(1)} / {MOVE_DISTANCE_M} m
              </p>
            )}
            {move.error && <p className="error">{move.error}</p>}
            {!m2.completed && !move.tracking && (
              <IonButton onClick={move.start}>Iniciar</IonButton>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard className={m3.completed ? "done" : !m2.completed ? "locked" : ""}>
          <IonCardHeader>
            <IonCardTitle>
              {m3.title}{" "}
              <IonBadge color={m3.completed ? "success" : "medium"}>
                {m3.completed ? "completada" : m2.completed ? "pendiente" : "bloqueada"}
              </IonBadge>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{m3.description}</p>
            <p className="muted">{m3.points} puntos</p>
            {still.running && (
              <p>
                Quieto... {still.secondsLeft}s de {STILL_SECONDS}s (si te mueves se reinicia)
              </p>
            )}
            {still.error && <p className="error">{still.error}</p>}
            {!m3.completed && !still.running && (
              <IonButton disabled={!m2.completed} onClick={still.start}>
                Iniciar
              </IonButton>
            )}
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" color="secondary" onClick={() => navigate("/results")}>
          Ver resultados y ranking
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
