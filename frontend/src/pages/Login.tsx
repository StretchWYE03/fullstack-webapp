import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../auth/supabaseConfig";

function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setError(""); try { await signIn(email, password); navigate("/", { replace: true }); window.location.reload(); } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); } finally { setLoading(false); } };
  return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><span className="brand"><span>✦</span> level up</span><h1>Welcome back.</h1><p>Your next small win is waiting.</p><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /><button className="primary-button" disabled={loading}>{loading ? "Entering your quest…" : "Continue"}</button>{error && <p className="auth-error">{error}</p>}<p className="auth-switch">New here? <Link to="/signup">Create a free account</Link></p></form></main>;
}
export default Login;
