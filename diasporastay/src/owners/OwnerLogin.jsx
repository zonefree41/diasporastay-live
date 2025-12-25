// src/owners/OwnerLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUserTie,
    FaEnvelope,
    FaKey,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import "../styles/theme.css";

const API = import.meta.env.VITE_API_URL;

export default function OwnerLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [capsWarning, setCapsWarning] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);

        try {
            const res = await fetch(`${API}/api/owner/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const text = await res.text(); // prevents JSON crash
                throw new Error(text || "Login failed");
            }

            const data = await res.json();

            // ✅ Save OWNER session
            localStorage.setItem("ownerToken", data.token);
            localStorage.setItem("ownerEmail", data.owner.email);

            // ✅ Clear guest session
            localStorage.removeItem("guestToken");
            localStorage.removeItem("guestEmail");
            localStorage.removeItem("guestId");

            // 🔁 Sync navbar / guards
            window.dispatchEvent(new Event("navbarUpdate"));

            // ✅ Success feedback (safe)
            alert(err.message || "Login failed");

            // ✅ Navigate
            navigate("/owner/dashboard");
        } catch (err) {
            console.error("OWNER LOGIN ERROR:", err);
            toastError(err.message || "Login failed");
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
                    <FaUserTie className="auth-icon-gold" />
                    <h2 className="fw-bold text-gold mt-2">Owner Login</h2>
                    <p className="text-muted small">
                        Manage your hotels & bookings.
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin}>
                    {/* Email */}
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

                    {/* Password */}
                    <div className="input-group-custom mb-2 input-wrapper">
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

                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {capsWarning && (
                        <div className="text-danger small fw-semibold mb-3">
                            ⚠ Caps Lock is ON
                        </div>
                    )}

                    {/* Submit */}
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
                    <Link className="premium-link" to="/owner/forgot-password">
                        Forgot password?
                    </Link>
                </div>

                {/* REGISTER */}
                <p className="text-center mt-3 mb-0">
                    Don’t have an account?{" "}
                    <Link
                        className="premium-link fw-semibold"
                        to="/owner/register"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
