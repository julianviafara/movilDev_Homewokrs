import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../firebase";
import { MISSIONS } from "../missions";
import { MissionDef, Progress } from "../types";
import { loadLocal, saveLocal } from "../services/localStorage";
import { loadRemote, saveRemote } from "../services/progressService";
import { notifyMissionCompleted } from "../services/notifications";

export interface MissionView extends MissionDef {
  completed: boolean;
}

interface AppContextValue {
  user: User | null;
  authReady: boolean;
  missions: MissionView[];
  points: number;
  completedCount: number;
  total: number;
  percent: number;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeMission: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const buildProgress = (ids: number[]): Progress => ({
  points: MISSIONS.filter((m) => ids.includes(m.id)).reduce((s, m) => s + m.points, 0),
  missions: MISSIONS.map((m) => ({ id: m.id, completed: ids.includes(m.id) })),
});

const toIds = (p: Progress | null): number[] =>
  p ? p.missions.filter((m) => m.completed).map((m) => m.id) : [];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const idsRef = useRef<number[]>([]);

  const applyIds = (ids: number[]) => {
    idsRef.current = ids;
    setCompletedIds(ids);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const local = loadLocal(u.uid);
        let remote: Progress | null = null;
        try {
          remote = await loadRemote(u.uid);
        } catch {
        }
        const best = (remote?.points ?? -1) >= (local?.points ?? -1) ? remote : local;
        applyIds(toIds(best));
      } else {
        applyIds([]);
      }
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    setUser({ ...cred.user } as User);
    await saveRemote({ uid: cred.user.uid, email, name }, buildProgress([])).catch(() => {});
  };

  const logout = async () => {
    await signOut(auth);
  };

  const completeMission = useCallback(
    async (id: number) => {
      if (!user || idsRef.current.includes(id)) return;
      const ids = [...idsRef.current, id];
      applyIds(ids);

      const progress = buildProgress(ids);
      saveLocal(user.uid, progress);
      try {
        await saveRemote(
          {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email || "Usuario",
          },
          progress
        );
      } catch (e) {
        console.error("No se pudo enviar a Firebase", e);
      }

      await notifyMissionCompleted(MISSIONS.length - ids.length);
    },
    [user]
  );

  const missions = useMemo<MissionView[]>(
    () => MISSIONS.map((m) => ({ ...m, completed: completedIds.includes(m.id) })),
    [completedIds]
  );
  const points = useMemo(() => buildProgress(completedIds).points, [completedIds]);
  const completedCount = completedIds.length;
  const total = MISSIONS.length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <AppContext.Provider
      value={{
        user,
        authReady,
        missions,
        points,
        completedCount,
        total,
        percent,
        login,
        register,
        logout,
        completeMission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
};
