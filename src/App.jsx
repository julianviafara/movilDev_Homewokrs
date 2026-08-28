import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import initialContacts from "./data/initialContacts";
import "./App.css";
import icon from "./assets/icon.jpg";

//Joker inspired app xd

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(initialContacts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddContact = (newContact) => {
    setContacts((prev) => [...prev, newContact]);
  };

  const handleDeleteContact = (id) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Why so serious about contacts?</h1>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <main className="app-content">
          <ContactForm onAddContact={handleAddContact} />
          <ContactList contacts={contacts} onDelete={handleDeleteContact} />
          <div className="icon-container">
           <img src={icon} alt="icon" className="icon" />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;