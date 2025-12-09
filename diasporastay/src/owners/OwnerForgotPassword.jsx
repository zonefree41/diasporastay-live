import { useState } from "react";
import api from "../axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import "../styles/theme.css";

export default function OwnerForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/api/owner/auth/forgot-password", {
                email,
            });

            setSuccess(res.data.message || "Password reset link sent!");
        } catch (err) {
            setError(err.response?.data?.error || "Email not found.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center py-5">
            <div className="auth-card luxury-card shadow-lg p-4 rounded-4" style={{ maxWidth: 420 }}>

                <div className="text-center mb-4">
                    <FaEnvelope className="auth-icon-gold" />
                    <h2 className="fw-bold text-gold mt-2">Forgot Password</h2>
                    <p className="text-muted small">We will send you a reset link.</p>
                </div>

                {error && <div className="alert alert-danger text-center py-2">{error}</div>}
                {success && (
                    <div className="alert alert-success text-center py-2 success-animate">
                        <span className="checkmark-bounce">✔</span>
                        &nbsp; {success}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success text-center py-2 success-animate">
                        <span className="checkmark-bounce">✔</span>
                        &nbsp; {success}
                    </div>
                )}



                <form onSubmit={handleSubmit}>
                    <div className="input-group-custom mb-4">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            className="form-control input-field"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn premium-btn-filled-gold w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : (
                            <>
                                Send Reset Link &nbsp;
                                <FaPaperPlane />
                            </>
                        )}
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
