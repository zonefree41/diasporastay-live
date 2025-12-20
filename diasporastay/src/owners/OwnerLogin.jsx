// src/owners/OwnerLogin.jsx
import { useState } from "react";
import api from "../axios";  // ✅ use configured axios instance
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie, FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const res = await fetch(`${API}/api/owners/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
});

import "../styles/theme.css";

export default function OwnerLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [capsWarning, setCapsWarning] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/owner/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // ✅ Always parse safely
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // ✅ SAVE OWNER SESSION
            localStorage.setItem("ownerToken", data.token);
            localStorage.setItem("ownerEmail", data.email);

            // ✅ CLEAR GUEST SESSION (IMPORTANT)
            localStorage.removeItem("guestToken");
            localStorage.removeItem("guestEmail");

            window.dispatchEvent(new Event("navbarUpdate"));
            navigate("/owner/dashboard");

        } catch (err) {
            console.error("LOGIN ERROR:", err.message);
            alert(err.message);
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
                        Access your dashboard & manage your hotels.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger text-center py-2">
                        {error}
                    </div>
                )}

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
                    <div className="input-group-custom mb-4 input-wrapper">
                        <FaKey className="input-icon" />

                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            onKeyDown={(e) => setCapsWarning(e.getModifierState("CapsLock"))}
                            onKeyUp={(e) => setCapsWarning(e.getModifierState("CapsLock"))}
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

                    {/* Login Button */}
                    <button
                        className="btn premium-btn-filled-gold w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Forgot Password */}
                <div className="text-center mt-3">
                    <Link className="premium-link" to="/owner/forgot-password">
                        Forgot Password?
                    </Link>
                </div>

                {/* Registration Link */}
                <p className="text-center mt-3">
                    Don’t have an account?{" "}
                    <Link className="premium-link fw-semibold" to="/owner/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
