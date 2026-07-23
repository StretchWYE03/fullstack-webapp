import { useUser } from "./UserContext";
import Login from "../pages/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { role, loading } = useUser();

    if (loading) return <p>Loading...</p>;
    if (!role) return <Login />;
    return <>{children}</>;
}

export default ProtectedRoute;