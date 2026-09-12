import { useState, useEffect } from "react";
import { Visita, EstadoVisita, SEED_VISITS } from "../data/visits";

const STORAGE_KEY = "visitas_data";

export function useVisits() {
  const [visits, setVisits] = useState<Visita[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setVisits(JSON.parse(stored));
    } else {
      setVisits(SEED_VISITS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VISITS));
    }
  }, []);

  const nextEstado = (estado: EstadoVisita): EstadoVisita => {
    if (estado === "pendiente") return "en_camino";
    if (estado === "en_camino") return "finalizada";
    return "finalizada";
  };

  const advanceEstado = (id: string) => {
    const updated = visits.map((v) =>
      v.id === id ? { ...v, estado: nextEstado(v.estado) } : v
    );
    setVisits(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getVisit = (id: string) => visits.find((v) => v.id === id);

  return { visits, advanceEstado, getVisit };
}