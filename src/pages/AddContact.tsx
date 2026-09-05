import { useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
} from "@ionic/react";

import ContactForm from "../components/ContactForm";
import type { Contact } from "../types/contact";

interface AddContactProps {
  onAddContact: (contact: Contact) => void;
}

const AddContact: React.FC<AddContactProps> = ({ onAddContact }) => {
  const navigate = useNavigate();

  const handleAdd = (contact: Contact) => {
    onAddContact(contact);
    navigate("/home");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>New contact</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding page-stage">
        <div className="contact-form">
          <div className="deco-rule">
            <span>New act</span>
          </div>
          <ContactForm onAddContact={handleAdd} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddContact;