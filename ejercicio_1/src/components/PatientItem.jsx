export default function PatientItem({ patient }) {
    return (
      <li className="patient-item">
        <span className="patient-name">{patient.nombre} {patient.apellido}</span>
        <span className="patient-cc">CC: {patient.cc}</span>
        <span className="patient-phone">{patient.telefono || "—"}</span>
      </li>
    );
  }