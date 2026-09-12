export type EstadoVisita = "pendiente" | "en_camino" | "finalizada";

export interface Visita {
  id: string;
  paciente: string;
  hora: string;
  estado: EstadoVisita;
}

export const SEED_VISITS: Visita[] = [
  { id: "1", paciente: "Carlos Medina", hora: "08:30", estado: "pendiente" },
  { id: "2", paciente: "Laura Gómez", hora: "10:00", estado: "pendiente" },
  { id: "3", paciente: "Jorge Pineda", hora: "11:15", estado: "en_camino" },
  { id: "4", paciente: "María Fernanda Ruiz", hora: "14:00", estado: "pendiente" },
];