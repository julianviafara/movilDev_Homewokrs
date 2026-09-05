import { useParams, useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";
import type { Contact } from "../types/contact";

interface ContactDetailProps {
  contacts: Contact[];
  onDelete: (id: number) => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contacts, onDelete }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const contact = contacts.find((c) => c.id === Number(id));

  const handleDelete = () => {
    if (contact) {
      onDelete(contact.id);
      navigate("/home");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Contact details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding page-stage">
        <div className="detail-card">
          <div className="deco-rule">
            <span>File</span>
          </div>
          {contact ? (
            <>
              <IonItem lines="none">
                <IonLabel>
                  <h1 className="detail-name">{contact.name}</h1>
                  <p>{contact.phone}</p>
                </IonLabel>
              </IonItem>

              <IonButton expand="block" color="danger" onClick={handleDelete}>
                Delete contact
              </IonButton>
            </>
          ) : (
            <p>Contact not found.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ContactDetail;