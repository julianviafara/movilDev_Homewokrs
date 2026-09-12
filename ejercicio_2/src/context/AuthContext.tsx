import { createContext, useContext, useState, ReactNode } from "react";
import { USERS, User } from "../data/users";

const STORAGE_KEY = "visitas_app_session";
type Session = Omit<User, "password">;

interface AuthContextValue {
  user: Session | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(() => {
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}