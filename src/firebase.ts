import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkjlZdeya0l3BQGNMNERUliJVdyS93TIk",
  authDomain: "parcial2-5f959.firebaseapp.com",
  projectId: "parcial2-5f959",
  storageBucket: "parcial2-5f959.firebasestorage.app",
  messagingSenderId: "331536285423",
  appId: "1:331536285423:web:2e25f53a511e529559e51a",
  measurementId: "G-X1Z86JSZGR",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
