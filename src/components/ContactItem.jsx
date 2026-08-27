function ContactItem({ contact, onDelete }) {
    return (
      <li className="contact-item">
        <div className="contact-info">
          <span className="contact-name">{contact.name}</span>
          <span className="contact-phone">{contact.phone}</span>
        </div>
        <button className="delete-btn" onClick={() => onDelete(contact.id)}>
          Delete
        </button>
      </li>
    );
  }
  
  export default ContactItem;