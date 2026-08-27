import ContactItem from "./ContactItem";

function ContactList({ contacts, onDelete }) {
  if (contacts.length === 0) {
    return <p className="empty-message">No contacts yet. Add one above!</p>;
  }

  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default ContactList;