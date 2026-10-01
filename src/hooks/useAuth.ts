import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
  } from "firebase/auth";
  
  import { useEffect, useState } from "react";
  import { auth } from "../services/firebase";
  
  export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
  
      return unsubscribe;
    }, []);
  
    const register = async (
      email: string,
      password: string
    ) => {
      return await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    };
  
    const login = async (
      email: string,
      password: string
    ) => {
      return await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    };
  
    const logout = async () => {
      await signOut(auth);
    };
  
    return {
      user,
      loading,
      register,
      login,
      logout,
    };
  };