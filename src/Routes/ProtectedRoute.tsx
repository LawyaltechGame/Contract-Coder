import { Navigate } from "react-router-dom";
import { useAppwriteAuth } from "../context/AppwriteAuthContext";
import { ReactNode } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAppwriteAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;