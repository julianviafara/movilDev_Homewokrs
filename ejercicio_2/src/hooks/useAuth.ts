import { useState } from "react";
import { USERS, User } from "../data/users";

const STORAGE_KEY = "visitas_app_session";

export function useAuth() {
  const [user, setUser] = useState<Omit<User, "password"> | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, password: string) => {
    const found = USERS.find((u) => u.username === username && u.password === password);
    if (found) {
      const session = { username: found.username, nombre: found.nombre };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(session);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, login, logout };
}