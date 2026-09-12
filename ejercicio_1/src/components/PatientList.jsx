import PatientItem from "./PatientItem";

export default function PatientList({ patients }) {
  if (patients.length === 0) {
    return <p className="empty-state">No hay pacientes registrados.</p>;
  }
  return (
    <ul className="patient-list">
      {patients.map((p) => <PatientItem key={p.id} patient={p} />)}
    </ul>
  );
}