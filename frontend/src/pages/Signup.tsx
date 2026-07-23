import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../api/v1/client";
import { signUp } from "../auth/supabaseConfig";

function Signup() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => { event.preventDefault(); if (password !== confirm) return setError("Passwords don’t match."); if (password.length < 6) return setError("Choose at least 6 characters."); setLoading(true); setError(""); try { const result = await signUp(email, password); if (result.access_token) await apiClient.post("/users/register"); navigate("/", { replace:true }); } catch (err) { setError(err instanceof Error ? err.message : "Unable to create your account."); } finally { setLoading(false); } };
  return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><span className="brand"><span>✦</span> level up</span><h1>Start your story.</h1><p>Build better days, one quest at a time.</p><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /><label htmlFor="confirm">Confirm password</label><input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" /><button className="primary-button" disabled={loading}>{loading ? "Creating your account…" : "Begin my quest"}</button>{error && <p className="auth-error">{error}</p>}<p className="auth-switch">Already playing? <Link to="/login">Sign in</Link></p></form></main>;
}
export default Signup;
