import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { addOutline, logOutOutline } from "ionicons/icons";

import ContactList from "../components/ContactList";
import type { Contact } from "../types/contact";

interface HomeProps {
  contacts: Contact[];
  onDelete: (id: number) => void;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ contacts, onDelete, onLogout }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Why so serious about contacts?</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onLogout}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="page-stage">
          <div className="contact-sheet">
            <div className="deco-rule">
              <span>The list</span>
            </div>
            <ContactList contacts={contacts} onDelete={onDelete} />
          </div>

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton routerLink="/add" color="secondary">
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;