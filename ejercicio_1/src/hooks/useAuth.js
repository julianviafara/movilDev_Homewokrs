import { useState, useEffect } from "react";
import { USERS } from "../data/users";

const STORAGE_KEY = "patients_app_session";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (username, password) => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const session = { username: found.username };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(session);
      setError("");
      return true;
    }
    setError("Usuario o contraseña incorrectos.");
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, error, login, logout };
}