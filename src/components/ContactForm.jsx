import { useState } from "react";

function ContactForm({ onAddContact }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === "" || phone.trim() === "") return;

    const newContact = {
      id: Date.now(), 
      name: name.trim(),
      phone: phone.trim(),
    };

    onAddContact(newContact);

    // reset the form
    setName("");
    setPhone("");
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit">Add contact</button>
    </form>
  );
}

export default ContactForm;