import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Progress, RankingEntry } from "../types";

export async function loadRemote(uid: string): Promise<Progress | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { points: d.points ?? 0, missions: d.missions ?? [] };
}

export async function saveRemote(
  user: { uid: string; email: string | null; name: string },
  progress: Progress
) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.name,
      email: user.email,
      points: progress.points,
      missions: progress.missions,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function fetchRanking(
  uid: string,
  myName: string,
  myPoints: number
): Promise<RankingEntry[]> {
  const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
  const snap = await getDocs(q);

  const others: RankingEntry[] = snap.docs
    .filter((d) => d.id !== uid)
    .slice(0, 4)
    .map((d) => ({
      uid: d.id,
      name: d.data().name || d.data().email || "Usuario",
      points: d.data().points ?? 0,
      isMe: false,
    }));

  const me: RankingEntry = { uid, name: myName, points: myPoints, isMe: true };
  return [...others, me].sort((a, b) => b.points - a.points);
}
