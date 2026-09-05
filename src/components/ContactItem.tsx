import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
  } from "@ionic/react";
  import type { Contact } from "../types/contact";
  
  interface ContactItemProps {
    contact: Contact;
    onDelete: (id: number) => void;
  }
  
  const ContactItem: React.FC<ContactItemProps> = ({ contact, onDelete }) => {
    return (
      <IonItemSliding>
        <IonItem routerLink={`/contact/${contact.id}`} detail>
          <IonLabel>
            <h2>{contact.name}</h2>
            <p>{contact.phone}</p>
          </IonLabel>
        </IonItem>
  
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={() => onDelete(contact.id)}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    );
  };
  
  export default ContactItem;