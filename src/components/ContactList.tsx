import { IonList, IonText } from "@ionic/react";
import ContactItem from "./ContactItem";
import type { Contact } from "../types/contact";

interface ContactListProps {
  contacts: Contact[];
  onDelete: (id: number) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onDelete }) => {
  if (contacts.length === 0) {
    return (
      <IonText color="medium">
        <p className="empty-laughs">The house is empty. Add a new act.</p>
      </IonText>
    );
  }

  return (
    <IonList>
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onDelete={onDelete} />
      ))}
    </IonList>
  );
};

export default ContactList;