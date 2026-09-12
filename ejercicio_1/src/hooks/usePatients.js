import { useState, useEffect } from "react";

const STORAGE_KEY = "patients_data";

export function usePatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPatients(JSON.parse(stored));
  }, []);

  const addPatient = (patient) => {
    const updated = [...patients, { ...patient, id: Date.now() }];
    setPatients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { patients, addPatient };
}