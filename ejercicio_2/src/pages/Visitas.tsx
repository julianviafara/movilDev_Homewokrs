import { useNavigate } from "react-router-dom";
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonBadge } from "@ionic/react";
import { useVisits } from "../hooks/useVisits";
import { EstadoVisita } from "../data/visits";

const ESTADO_LABEL: Record<EstadoVisita, string> = {
  pendiente: "Pendiente",
  en_camino: "En camino",
  finalizada: "Finalizada",
};

const ESTADO_COLOR: Record<EstadoVisita, string> = {
  pendiente: "medium",
  en_camino: "warning",
  finalizada: "success",
};

export default function Visitas() {
  const { visits } = useVisits();
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="deco-toolbar"><IonTitle>Visitas de Hoy</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {visits.map((v) => (
            <IonItem key={v.id} button onClick={() => navigate(`/tabs/visitas/${v.id}`)}>
              <IonLabel>
                <h2>{v.paciente}</h2>
                <p>{v.hora}</p>
              </IonLabel>
              <IonBadge color={ESTADO_COLOR[v.estado]} slot="end">{ESTADO_LABEL[v.estado]}</IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}