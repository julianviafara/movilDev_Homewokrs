import { useState, useEffect } from "react";
import { IonApp, IonRouterOutlet, IonLoading, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Routes, Route, Navigate } from "react-router-dom";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "./theme/variables.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AddContact from "./pages/AddContact";
import ContactDetail from "./pages/ContactDetail";
import initialContacts from "./data/initialContacts";
import type { Contact } from "./types/contact";

setupIonicReact();

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Read the token once, on first render
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem("logged") === "true"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(initialContacts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddContact = (newContact: Contact) => {
    setContacts((prev) => [...prev, newContact]);
  };

  const handleDeleteContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("logged");
    setIsLoggedIn(false);
  };

  return (
    <IonApp>
      <IonLoading isOpen={loading} message="Loading contacts..." />

      {!loading && (
        <IonReactRouter>
          <IonRouterOutlet>
            <Routes>
              <Route
                path="/login"
                element={
                  isLoggedIn ? <Navigate to="/home" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
                }
              />

              <Route
                path="/home"
                element={
                  isLoggedIn ? (
                    <Home contacts={contacts} onDelete={handleDeleteContact} onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/add"
                element={isLoggedIn ? <AddContact onAddContact={handleAddContact} /> : <Navigate to="/login" replace />}
              />

              <Route
                path="/contact/:id"
                element={
                  isLoggedIn ? (
                    <ContactDetail contacts={contacts} onDelete={handleDeleteContact} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
            </Routes>
          </IonRouterOutlet>
        </IonReactRouter>
      )}
    </IonApp>
  );
};

export default App;