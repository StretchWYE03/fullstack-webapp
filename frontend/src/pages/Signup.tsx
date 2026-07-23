import { useState } from "react";
import { signUp } from "../auth/supabaseConfig";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/v1/client";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    // ============================================================
    // Basic validation — customize rules here
    // e.g. add password strength requirements
    // ============================================================
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);

      // Register the user role in our backend immediately after signup
      await apiClient.post("/users/register");

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    // ============================================================
    // CUSTOMIZABLE: page layout and background color
    // ============================================================
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f0f0",
    }}>
      <div style={{
        width: "360px",
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}>

        {/* ============================================================
            CUSTOMIZABLE: page title and subtitle
        ============================================================ */}
        <h1 style={{ marginBottom: "0.25rem" }}>Create Account</h1>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>
          Sign up to get started
        </p>

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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", boxSizing: "border-box" }}
        />

        {/* ============================================================
            CUSTOMIZABLE: button color and text
        ============================================================ */}
        <button
          onClick={handleSignup}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
        )}

        {/* Link back to login */}
        <p style={{ marginTop: "1rem", textAlign: "center", color: "#666" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#4f46e5", cursor: "pointer" }}
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;