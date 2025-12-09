import { useState } from "react";
import api from "../axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaKey, FaEye, FaEyeSlash, FaUnlockAlt } from "react-icons/fa";
import "../styles/theme.css";

export default function OwnerResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post(`/api/owner/auth/reset-password/${token}`, {
                password,
            });

            setSuccess("Password updated successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/owner/login");
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.error || "Reset link expired or invalid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center py-5">
            <div className="auth-card luxury-card shadow-lg p-4 rounded-4" style={{ maxWidth: 420 }}>

                <div className="text-center mb-4">
                    <FaUnlockAlt className="auth-icon-gold" />
                    <h2 className="fw-bold text-gold mt-2">Reset Password</h2>
                    <p className="text-muted small">Enter your new password below.</p>
                </div>

                {error && <div className="alert alert-danger text-center py-2">{error}</div>}
                {success && <div className="alert alert-success text-center py-2">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/* NEW PASSWORD */}
                    <div className="input-group-custom mb-3 input-wrapper">
                        <FaKey className="input-icon" />

                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control input-field"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="input-group-custom mb-1 input-wrapper">
                        <FaKey className="input-icon" />

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control input-field"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />

                        <span
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* LIVE MATCH INDICATOR */}
                    {confirm.length > 0 && (
                        <div
                            className={
                                password === confirm
                                    ? "text-success small fw-semibold ms-1"
                                    : "text-danger small fw-semibold ms-1"
                            }
                        >
                            {password === confirm ? "✔ Passwords match" : "✖ Passwords do not match"}
                        </div>
                    )}

                    <button
                        className="btn premium-btn-filled-gold w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>

                <p className="text-center mt-3">
                    <Link className="premium-link fw-semibold" to="/owner/login">
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    );
}
