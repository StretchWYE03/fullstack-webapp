import { useState } from "react";
import { signIn } from "../auth/supabaseConfig";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            await signIn(email, password);
            //Force page to reload to trigger auth check
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };
    return (
        // =====================================================================================
        // CUSTOMIZABLE: Overall page layout and background colour
        // =====================================================================================
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f0f0f0", // <- Change page background here. CURRENT: White
        }}>
        <div style={{
            // Customize card width, padding, border radius, shadow
            width: "360px",
            padding: "2rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        }}>
            
            <h1 style={{ marginBottom: "0.25rem" }}>My Web App</h1>
            <p style={{ marginBottom: "1.5rem", color: "#666" }}>Sign in to continue</p>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", boxSizing: "border-box" }}
                />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", boxSizing: "border-box" }}
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                }}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
                {error && (
                    <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
                )}

            </div>
        </div>
    );
}

export default Login;