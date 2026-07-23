// ============================================================
// SUPABASE AUTH — direct REST API approach
// Bypasses the Supabase JS client which has known hanging
// issues in some network environments.
// ============================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ============================================================
// Sign in with email and password
// Returns the session object including access_token
// ============================================================
export async function signIn(email: string, password: string) {
    const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
    }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || "Login failed");
    
  // Store token in memory
    sessionStorage.setItem("access_token", data.access_token);
    return data;
}

// ============================================================
// Sign up with email and password
// Supabase creates the account and returns a session
// ============================================================
export async function signUp(email: string, password: string) {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.msg || "Signup failed");

  // Store token so backend registration can fire immediately
  if (data.access_token) {
    sessionStorage.setItem("access_token", data.access_token);
  }
  return data;
}

// ============================================================
// Sign out — clears the local token
// ============================================================
export async function signOut() {
    sessionStorage.removeItem("access_token");
}

// ============================================================
// Get the current access token
// ============================================================
export function getAccessToken(): string | null {
    return sessionStorage.getItem("access_token");
}

// ============================================================
// Check if user is logged in
// ============================================================
export function isLoggedIn(): boolean {
    return !!sessionStorage.getItem("access_token");
}