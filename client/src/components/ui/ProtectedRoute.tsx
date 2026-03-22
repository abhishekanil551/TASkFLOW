import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuth, loading } = useAuthContext();

  if (loading) return <>Loading...</>;

  if (!isAuth) return <Navigate to="/" />;

  return <>{children}</>;
}