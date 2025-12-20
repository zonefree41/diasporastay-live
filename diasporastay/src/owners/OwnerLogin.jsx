// src/owners/OwnerLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserTie, FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/theme.css";

export default function OwnerLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [capsWarning, setCapsWarning] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/api/owners/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const text = await res.text(); // ⛑ prevents JSON crash
                throw new Error(text || "Login failed");
            }

            const data = await res.json();

            // ✅ SAVE OWNER SESSION
            localStorage.setItem("ownerToken", data.token);
            localStorage.setItem("ownerEmail", data.owner.email);
            localStorage.setItem("ownerId", data.owner._id);

            // ✅ CLEAR GUEST SESSION (VERY IMPORTANT)
            localStorage.removeItem("guestToken");
            localStorage.removeItem("guestEmail");
            localStorage.removeItem("guestId");

            // 🔄 Sync navbar + route guards
            window.dispatchEvent(new Event("navbarUpdate"));

            // ✅ Redirect to dashboard
            navigate("/owner/dashboard");

        } catch (err) {
            console.error("OWNER LOGIN ERROR:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center py-5">
            <div
                className="auth-card luxury-card shadow-lg p-4 rounded-4"
                style={{ maxWidth: 420 }}
            >
                {/* HEADER */}
                <div className="text-center mb-4">
                    <FaUserTie className="auth-icon-gold pulse-icon" />
                    <h2 className="fw-bold text-gold mt-2">Owner Login</h2>
                    <p className="text-muted small">
                        Access your dashboard and manage your hotels.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="alert alert-danger text-center py-2">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleLogin}>
                    {/* EMAIL */}
                    <div className="input-group-custom mb-3">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            className="form-control input-field"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-group-custom mb-4 input-wrapper">
                        <FaKey className="input-icon" />

                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            onKeyDown={(e) =>
                                setCapsWarning(e.getModifierState("CapsLock"))
                            }
                            onKeyUp={(e) =>
                                setCapsWarning(e.getModifierState("CapsLock"))
                            }
                        />

                        {capsWarning && (
                            <div className="text-danger small fw-semibold ms-1">
                                ⚠ Caps Lock is ON
                            </div>
                        )}

                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* SUBMIT */}
                    <button
                        className="btn premium-btn-filled-gold w-100"
                        disabled={loading}
                        type="submit"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* LINKS */}
                <div className="text-center mt-3">
                    <Link className="premium-link-gold" to="/owner/forgot-password">
                        Forgot password?
                    </Link>
                </div>

                <p className="text-center mt-3 mb-0">
                    Don’t have an account?{" "}
                    <Link className="premium-link-gold fw-semibold" to="/owner/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
