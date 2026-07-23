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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (isLoggedIn()) {
        fetchRole();
    } else {
        setLoading(false);
    }
    }, []);

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

export function useUser() {
    return useContext(UserContext);
}