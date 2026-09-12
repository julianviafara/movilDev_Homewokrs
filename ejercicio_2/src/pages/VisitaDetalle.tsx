import { useParams } from "react-router-dom";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonBadge,
} from "@ionic/react";
import { useVisits } from "../hooks/useVisits";
import { EstadoVisita } from "../data/visits";

const ESTADO_LABEL: Record<EstadoVisita, string> = {
  pendiente: "Pendiente",
  en_camino: "En camino",
  finalizada: "Finalizada",
};

export default function VisitaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { getVisit, advanceEstado } = useVisits();
  const visita = getVisit(id);

  if (!visita) {
    return <IonPage><IonContent className="ion-padding">Visita no encontrada.</IonContent></IonPage>;
  }

  const isFinal = visita.estado === "finalizada";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="deco-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/tabs/visitas" /></IonButtons>
          <IonTitle>Detalle de Visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard className="deco-card">
          <IonCardHeader><IonCardTitle>{visita.paciente}</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <p>Hora: {visita.hora}</p>
            <p>Estado actual: <IonBadge>{ESTADO_LABEL[visita.estado]}</IonBadge></p>
            <IonButton expand="block" className="deco-button" disabled={isFinal} onClick={() => advanceEstado(visita.id)}>
              {isFinal ? "Visita finalizada" : "Avanzar estado"}
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}