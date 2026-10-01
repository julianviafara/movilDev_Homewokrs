import {
    createContext,
    ReactNode,
    useContext,
  } from "react";
  
  import { User } from "firebase/auth";
  import { useAuth } from "../hooks/useAuth";
  
  interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (
      email: string,
      password: string
    ) => Promise<any>;
    login: (
      email: string,
      password: string
    ) => Promise<any>;
    logout: () => Promise<void>;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(
    undefined
  );
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider = ({
    children,
  }: AuthProviderProps) => {
    const auth = useAuth();
  
    return (
      <AuthContext.Provider value={auth}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuthContext = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuthContext must be used inside AuthProvider"
      );
    }
  
    return context;
  };