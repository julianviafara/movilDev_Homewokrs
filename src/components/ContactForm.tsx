import { useState } from "react";
import { IonItem, IonInput, IonButton } from "@ionic/react";
import type { Contact } from "../types/contact";

interface ContactFormProps {
  onAddContact: (contact: Contact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onAddContact }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (name.trim() === "" || phone.trim() === "") return;

    onAddContact({
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
    });

    setName("");
    setPhone("");
  };

  return (
    <div className="contact-form">
      <IonItem>
        <IonInput
          label="Name"
          labelPlacement="floating"
          value={name}
          onIonInput={(e: CustomEvent<{ value?: string | null }>) =>
            setName(e.detail.value ?? "")
          }
        />
      </IonItem>

      <IonItem>
        <IonInput
          label="Phone"
          labelPlacement="floating"
          type="tel"
          value={phone}
          onIonInput={(e: CustomEvent<{ value?: string | null }>) =>
            setPhone(e.detail.value ?? "")
          }
        />
      </IonItem>

      <IonButton expand="block" color="secondary" onClick={handleSubmit}>
        Add contact
      </IonButton>
    </div>
  );
};

export default ContactForm;