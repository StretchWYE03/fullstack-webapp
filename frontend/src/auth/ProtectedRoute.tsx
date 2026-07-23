import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { role, loading } = useUser();

  if (loading) return <main className="loading-screen">Loading your quest…</main>;
  if (!role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default ProtectedRoute;
