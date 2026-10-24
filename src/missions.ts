import { MissionDef } from "./types";

export const MOVE_DISTANCE_M = 50;
export const STILL_SECONDS = 10;
export const MOTION_THRESHOLD = 0.6;

export const MISSIONS: MissionDef[] = [
  {
    id: 1,
    title: "Evidencia",
    description: "Toma una foto con la cámara.",
    points: 30,
  },
  {
    id: 2,
    title: "Movimiento real",
    description: `Muévete ${MOVE_DISTANCE_M} metros de tu posición original.`,
    points: 40,
  },
  {
    id: 3,
    title: "Permanencia activa",
    description: `Quédate quieto ${STILL_SECONDS} segundos y el celular vibrará.`,
    points: 50,
  },
];

export const TOTAL_POINTS = MISSIONS.reduce((sum, m) => sum + m.points, 0);
