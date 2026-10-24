import { useEffect, useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useApp } from "../context/AppContext";
import { fetchRanking } from "../services/progressService";
import { RankingEntry } from "../types";

const Results: React.FC = () => {
  const { user, points, completedCount, total, percent } = useApp();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchRanking(user.uid, user.displayName || user.email || "Tú", points)
      .then(setRanking)
      .catch(() => setError("No se pudo cargar el ranking"));
  }, [user, points]);

  const status =
    completedCount === total
      ? "¡Completado!"
      : completedCount === 0
      ? "Sin empezar"
      : "En progreso";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Resultados</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="summary">
          <div className="points">{points} pts</div>
          <p>
            Misiones completadas: {completedCount}/{total} ({percent}%)
          </p>
          <p>
            Estado general: <strong>{status}</strong>
          </p>
        </div>

        <IonList>
          <IonListHeader>Ranking Top 5</IonListHeader>
          {ranking.map((r, i) => (
            <IonItem key={r.uid} className={r.isMe ? "me" : ""}>
              <IonLabel>
                {i + 1}. {r.name} {r.isMe && "(tú)"}
              </IonLabel>
              <IonLabel slot="end">{r.points} pts</IonLabel>
            </IonItem>
          ))}
        </IonList>
        {error && <p className="error">{error}</p>}
      </IonContent>
    </IonPage>
  );
};

export default Results;
