import { Navigate, Route } from "react-router-dom";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { medicalOutline, peopleOutline, personOutline } from "ionicons/icons";
import Visitas from "./Visitas";
import VisitaDetalle from "./VisitaDetalle";
import Pacientes from "./Pacientes";
import Perfil from "./Perfil";

export default function TabsLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/visitas" element={<Visitas />} />
        <Route path="/tabs/visitas/:id" element={<VisitaDetalle />} />
        <Route path="/tabs/pacientes" element={<Pacientes />} />
        <Route path="/tabs/perfil" element={<Perfil />} />
        <Route path="/tabs" element={<Navigate to="/tabs/visitas" replace />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={medicalOutline} />
          <IonLabel>Visitas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}