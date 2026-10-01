import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCPvQR0BQ9NuTQdES8uzdloiiM1uSYtcqY",
    authDomain: "task-deco.firebaseapp.com",
    projectId: "task-deco",
    storageBucket: "task-deco.firebasestorage.app",
    messagingSenderId: "125103305418",
    appId: "1:125103305418:web:cdadccbf578bb5f00aba33",
    measurementId: "G-3VMELSE9J4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics =
  typeof window !== "undefined"
    ? getAnalytics(app)
    : null;

export default app;