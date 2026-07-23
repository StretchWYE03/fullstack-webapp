import { useUser } from "../auth/UserContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { role, logout } = useUser();
    const navigate = useNavigate();

    return (
        // Customize navbar colour, padding, font etc.
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            backgroundColor: "#1e1e2e",
            color: "#ffffff",
        }}>
            {/* Customize app name/logo*/}
            <span
                onClick={() => navigate("/")}
                style={{ fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer"}}
            >
                My App {/* CHANGE TITLE HERE */}
                </span>

                {/* Right side: links and buttons*/}

                <div style={{ display: "flex", gap: "1rem", alignItems: "center"}}>

                <span
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    Home
                </span>

                {/* Logged in users can see this*/}
                {role && (
                    <span
                        onClick={() => navigate("/dashboard")}
                        style={{ cursor: "pointer" }}
                    >
                        Dashboard
                    </span>
                )}

                {/* Admin + Original Admin*/}
                {(role === "admin" || role === "original_admin") && (
                    <span
                        onClick={() => navigate("/admin")}
                        style={{ cursor: "pointer" }}
                    >
                        Admin
                    </span>
                )}

                {/* Original Admin only */}
                {role === "original_admin" && (
                    <span
                        onClick={() => navigate("/admin/users")}
                        style={{ cursor: "pointer" }}
                    >
                        Users
                    </span>
                )}

                {/* Guests see login and signup; Users see logout*/}
                {!role ? (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                padding: "0.4rem 1rem",
                                backgroundColor: "transparent",
                                color: "#ffffff",
                                border: "1px solid #ffffff",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            style={{
                                padding: "0.4rem 1rem",
                                backgroundColor: "#4f46e5", // ← change signup button color
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            >
                            Sign Up
                        </button>
                        </>
                        ) : (
                        <button
                            onClick={logout}
                            style={{
                            padding: "0.4rem 1rem",
                            backgroundColor: "transparent",
                            color: "#ffffff",
                            border: "1px solid #ffffff",
                            borderRadius: "4px",
                            cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                        )}
                    </div>
                </nav>
            );
}

export default Navbar;