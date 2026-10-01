import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { ReactNode } from "react";

interface AppRouteProps {
  children: ReactNode;
}

const AppRoute = ({ children }: AppRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AppRoute;