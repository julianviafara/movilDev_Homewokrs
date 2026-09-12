import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from "@ionic/react";
import { useVisits } from "../hooks/useVisits";

export default function Pacientes() {
  const { visits } = useVisits();
  const pacientes = Array.from(new Set(visits.map((v) => v.paciente)));

  return (
    <IonPage>
      <IonHeader><IonToolbar className="deco-toolbar"><IonTitle>Pacientes</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonList>
          {pacientes.map((nombre) => (
            <IonItem key={nombre}><IonLabel>{nombre}</IonLabel></IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}