import { useState } from "react";
import { validateName, validateCC, validatePhone } from "../utils/validators";

export default function PatientForm({ onAdd }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", cc: "", telefono: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!validateName(form.nombre)) newErrors.nombre = "Nombre inválido.";
    if (!validateName(form.apellido)) newErrors.apellido = "Apellido inválido.";
    if (!validateCC(form.cc)) newErrors.cc = "CC inválida (6-10 dígitos).";
    if (form.telefono && !validatePhone(form.telefono)) newErrors.telefono = "Teléfono inválido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(form);
    setForm({ nombre: "", apellido: "", cc: "", telefono: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      <h2 className="deco-subtitle">Nuevo Paciente</h2>
      <div className="form-grid">
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </label>
        <label>
          Apellido
          <input name="apellido" value={form.apellido} onChange={handleChange} />
          {errors.apellido && <span className="error-message">{errors.apellido}</span>}
        </label>
        <label>
          CC
          <input name="cc" value={form.cc} onChange={handleChange} />
          {errors.cc && <span className="error-message">{errors.cc}</span>}
        </label>
        <label>
          Teléfono
          <input name="telefono" value={form.telefono} onChange={handleChange} />
          {errors.telefono && <span className="error-message">{errors.telefono}</span>}
        </label>
      </div>
      <button type="submit" className="btn-primary">Agregar Paciente</button>
    </form>
  );
}