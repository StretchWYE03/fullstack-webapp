import { createContext, useContext, useEffect, useState } from "react";
import { isLoggedIn, signOut } from "./supabaseConfig";
import { apiClient } from "../api/v1/client";

type UserContextType = {
    role: string | null;
    userId: string | null;
    loading: boolean;
    logout: () => void;
};

const UserContext = createContext<UserContextType>({
    role: null,
    userId: null,
    loading: true,
    logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(isLoggedIn());

    useEffect(() => {
    if (!isLoggedIn()) return;
    const fetchRole = async () => {
        try {
            await apiClient.post("/users/register");
            const response = await apiClient.get("/users/me");
            setRole(response.data.role);
            setUserId(response.data.user_id);
        } catch (error) {
            console.error("Failed to fetch role:", error);
        } finally {
            setLoading(false);
        }
    };
    void fetchRole();
    }, []);

    const logout = () => {
        signOut();
        setRole(null);
        setUserId(null);
        window.location.reload();
    };

    return (
    <UserContext.Provider value={{ role, userId, loading, logout }}>
        {children}
    </UserContext.Provider>
    );
}

// This hook intentionally shares this module's context with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    return useContext(UserContext);
}
