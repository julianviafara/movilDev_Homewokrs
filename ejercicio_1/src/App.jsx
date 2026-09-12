import { useState, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { usePatients } from "./hooks/usePatients";
import Login from "./components/Login";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import SearchBar from "./components/SearchBar";
import "./App.css";

export default function App() {
  const { user, error, login, logout } = useAuth();
  const { patients, addPatient } = usePatients();
  const [search, setSearch] = useState("");

  // search state lives here, filtered list goes down to PatientList
  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.apellido.toLowerCase().includes(term) ||
        p.cc.includes(term)
    );
  }, [patients, search]);

  if (!user) return <Login onLogin={login} error={error} />;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="deco-title">Administración de Pacientes</h1>
        <div className="header-actions">
          <span>Hola, {user.username}</span>
          <button onClick={logout} className="btn-secondary">Cerrar sesión</button>
        </div>
      </header>
      <div className="deco-divider" />
      <main>
        <PatientForm onAdd={addPatient} />
        <SearchBar value={search} onChange={setSearch} />
        <PatientList patients={filteredPatients} />
      </main>
    </div>
  );
}