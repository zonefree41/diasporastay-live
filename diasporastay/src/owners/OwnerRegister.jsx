// src/owners/OwnerRegister.jsx
import { useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie, FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/theme.css";

export default function OwnerRegister() {
    const navigate = useNavigate();

    // ⭐ ALL HOOKS MUST BE INSIDE THE COMPONENT
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [capsWarning, setCapsWarning] = useState(false);


    // Password strength function
    const getStrength = () => {
        let score = 0;

        if (password.length >= 6) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++; // special character

        if (score <= 1) return "weak";
        if (score === 2) return "medium";
        return "strong";
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            // ⭐ Correct API request
            const res = await api.post("/api/owner/auth/register", {
                name,
                email,
                password,
            });

            setSuccess("Registration successful! Redirecting to login...");

            // Redirect after a short delay
            setTimeout(() => navigate("/owner/login"), 1500);

        } catch (err) {
            console.error("REGISTER ERROR:", err.response?.data);
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center py-5">
            <div className="auth-card luxury-card shadow-lg p-4 rounded-4" style={{ maxWidth: 420 }}>

                {/* Header */}
                <div className="text-center mb-4">
                    <FaUserTie className="auth-icon-gold" />
                    <h2 className="fw-bold text-gold mt-2">Owner Registration</h2>
                    <p className="text-muted small">Create your DiasporaStay owner account.</p>
                </div>

                {/* Alerts */}
                {error && <div className="alert alert-danger text-center py-2">{error}</div>}
                {success && <div className="alert alert-success text-center py-2">{success}</div>}

                <form onSubmit={handleRegister}>

                    {/* Name */}
                    <div className="input-group-custom mb-3">
                        <FaUserTie className="input-icon" />
                        <input
                            type="text"
                            className="form-control input-field"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                    <div className="input-group-custom mb-3 input-wrapper">
                        <FaKey className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control input-field"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            onKeyDown={(e) => setCapsWarning(e.getModifierState("CapsLock"))}
                            onKeyUp={(e) => setCapsWarning(e.getModifierState("CapsLock"))}
                        />
                        <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Password Strength Bar */}
                    {password.length > 0 && (
                        <div className="strength-bar-wrapper my-2">
                            <div
                                className={`strength-segment ${getStrength() === "weak" || getStrength() === "medium" || getStrength() === "strong" ? "active weak" : ""}`}
                            ></div>

                            <div
                                className={`strength-segment ${getStrength() === "medium" || getStrength() === "strong" ? "active medium" : ""}`}
                            ></div>

                            <div
                                className={`strength-segment ${getStrength() === "strong" ? "active strong" : ""}`}
                            ></div>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="input-group-custom mb-1 input-wrapper">
                        <FaKey className="input-icon" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control input-field"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />

                        {capsWarning && (
                            <div className="text-danger small fw-semibold ms-1">
                                ⚠ Caps Lock is ON
                            </div>
                        )}

                        <span
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Password Match Indicator */}
                    {confirm.length > 0 && (
                        <div
                            className={
                                password === confirm
                                    ? "text-success small fw-semibold ms-1"
                                    : "text-danger small fw-semibold ms-1"
                            }
                        >
                            {password === confirm
                                ? "✔ Passwords match"
                                : "✖ Passwords do not match"}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        className="btn premium-btn-filled-gold w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link className="premium-link fw-semibold" to="/owner/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
