import { Progress } from "../types";

const key = (uid: string) => `parcial2_progress_${uid}`;

export function loadLocal(uid: string): Progress | null {
  try {
    const raw = localStorage.getItem(key(uid));
    return raw ? (JSON.parse(raw) as Progress) : null;
  } catch {
    return null;
  }
}

export function saveLocal(uid: string, progress: Progress) {
  try {
    localStorage.setItem(key(uid), JSON.stringify(progress));
  } catch {
  }
}
