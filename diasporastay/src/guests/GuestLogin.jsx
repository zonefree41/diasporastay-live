// src/guests/GuestLogin.jsx
import { useState } from "react";
import api from "../axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaKey, FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import "../styles/theme.css";

const API = import.meta.env.VITE_API_URL;

const res = await fetch(`${API}/api/guests/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});


export default function GuestLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");   // ⭐ ADD THIS
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [capsWarning, setCapsWarning] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/guests/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const text = await res.text(); // 👈 prevents JSON crash
                throw new Error(text || "Login failed");
            }

            const data = await res.json();


            // ✅ SAVE GUEST SESSION (CRITICAL)
            localStorage.setItem("guestToken", data.token);
            localStorage.setItem("guestEmail", data.guest.email);
            localStorage.setItem("guestId", data.guest._id);

            // ✅ REMOVE OWNER SESSION (IMPORTANT)
            localStorage.removeItem("ownerToken");
            localStorage.removeItem("ownerEmail");

            // 🔁 Sync navbar + guards
            window.dispatchEvent(new Event("navbarUpdate"));

            // ✅ Redirect AFTER storage
            navigate("/guest/profile");

        } catch (err) {
            console.error("GUEST LOGIN ERROR:", err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center py-5">

            <div className="auth-card luxury-card shadow-lg p-4 rounded-4" style={{ maxWidth: 420 }}>

                {/* Header */}
                <div className="text-center mb-4">
                    <FaUserCircle className="auth-icon-gold pulse-icon" />
                    <h2 className="fw-bold text-gold mt-2">Guest Login</h2>
                    <p className="text-muted small">
                        Sign in to access your bookings and profile.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger text-center py-2">{error}</div>
                )}

                {success && (
                    <div className="alert alert-success text-center py-2 success-animate">
                        <span className="checkmark-bounce">✔</span>
                        &nbsp; {success}
                    </div>
                )}


                {/* Login Form */}
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

                    {/* Submit Button */}
                    <button
                        className="btn premium-btn-filled-gold w-100"
                        disabled={loading}
                        type="submit"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Links */}
                <div className="text-center mt-3">
                    <Link className="premium-link-gold" to="/guest/forgot-password">
                        Forgot password?
                    </Link>
                </div>

                <p className="text-center mt-3 mb-0">
                    Don’t have an account?{" "}
                    <Link className="premium-link-gold fw-semibold" to="/guest/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
