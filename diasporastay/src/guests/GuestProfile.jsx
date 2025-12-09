// src/guests/GuestProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import "../styles/theme.css";
import {
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaGlobeAmericas,
    FaCalendarAlt,
    FaSignOutAlt,
    FaEdit,
    FaKey,
    FaBed,
    FaMoneyBillWave,
} from "react-icons/fa";
import "../styles/theme.css";

export default function GuestProfile() {
    const navigate = useNavigate();

    const [guest, setGuest] = useState(null);
    const [stats, setStats] = useState({
        totalBookings: 0,
        lastStay: null,
        totalSpent: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("guestToken");

                if (!token) {
                    setError("You are not logged in.");
                    navigate("/guest/login");
                    return;
                }

                // Explicitly send guest token
                const res = await api.get("/api/guests/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data?.guest || res.data;

                setGuest(data || null);

                // If your backend returns stats, map them here
                if (res.data?.stats) {
                    setStats({
                        totalBookings: res.data.stats.totalBookings || 0,
                        lastStay: res.data.stats.lastStay || null,
                        totalSpent: res.data.stats.totalSpent || 0,
                    });
                }
            } catch (err) {
                console.error("Guest profile load error:", err.response?.data || err);
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to load profile."
                );
                if (err.response?.status === 401) {
                    navigate("/guest/login");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("guestToken");
        localStorage.removeItem("guestEmail");
        localStorage.removeItem("guestId");
        window.dispatchEvent(new Event("navbarUpdate"));
        navigate("/");
    };

    const handleEditProfile = () => {
        // You can change this route to whatever you use
        navigate("/guest/profile/edit");
    };

    const handleChangePassword = () => {
        navigate("/guest/forgot-password");
    };

    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return "$0";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="guest-profile-page container py-4">
            {/* LOADING */}
            {loading && (
                <div className="gp-loading-card shadow-sm">
                    <div className="gp-loading-avatar shimmer" />
                    <div className="gp-loading-lines">
                        <div className="shimmer gp-line gp-line-lg" />
                        <div className="shimmer gp-line gp-line-md" />
                        <div className="shimmer gp-line gp-line-sm" />
                    </div>
                </div>
            )}

            {/* ERROR */}
            {!loading && error && (
                <div className="alert alert-danger text-center my-3">
                    {error}
                </div>
            )}

            {/* MAIN CONTENT */}
            {!loading && !error && guest && (
                <>
                    {/* Hero Card */}
                    <div className="gp-hero-card shadow-sm mb-4">
                        <div className="gp-hero-left d-flex align-items-center">
                            <div className="gp-avatar-wrapper">
                                {guest.avatarUrl ? (
                                    <img
                                        src={guest.avatarUrl}
                                        alt={guest.name || "Guest avatar"}
                                        className="gp-avatar-img"
                                    />
                                ) : (
                                    <img
                                        src={guest.avatarUrl || "/default-avatar.png"}
                                        alt="Avatar"
                                        className="gp-avatar-icon-img"
                                    />

                                )}
                            </div>
                            <div>
                                <h2 className="gp-name mb-1">
                                    {guest.name || "Guest"}
                                </h2>
                                <div className="gp-badge">
                                    DiasporaStay Guest
                                </div>
                                {guest.email && (
                                    <div className="gp-email mt-1">
                                        <FaEnvelope className="me-1" />
                                        {guest.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="gp-hero-actions">
                            <button
                                type="button"
                                className="btn btn-outline-primary gp-btn-outline me-2"
                                onClick={handleEditProfile}
                            >
                                <FaEdit className="me-1" />
                                Edit Profile
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary gp-btn-outline me-2"
                                onClick={handleChangePassword}
                            >
                                <FaKey className="me-1" />
                                Change Password
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger gp-btn-logout"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="me-1" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Info + Stats Grid */}
                    <div className="row gy-3">
                        {/* Guest Info Card */}
                        <div className="col-lg-6">
                            <div className="gp-card shadow-sm h-100">
                                <h5 className="gp-card-title mb-3">
                                    Profile Information
                                </h5>

                                <div className="gp-info-row">
                                    <span className="gp-info-label">
                                        <FaUserCircle className="me-2 text-primary" />
                                        Full Name
                                    </span>
                                    <span className="gp-info-value">
                                        {guest.name || "-"}
                                    </span>
                                </div>

                                <div className="gp-info-row">
                                    <span className="gp-info-label">
                                        <FaEnvelope className="me-2 text-primary" />
                                        Email
                                    </span>
                                    <span className="gp-info-value">
                                        {guest.email || "-"}
                                    </span>
                                </div>

                                <div className="gp-info-row">
                                    <span className="gp-info-label">
                                        <FaPhone className="me-2 text-primary" />
                                        Phone
                                    </span>
                                    <span className="gp-info-value">
                                        {guest.phone || "Add phone number"}
                                    </span>
                                </div>

                                <div className="gp-info-row">
                                    <span className="gp-info-label">
                                        <FaGlobeAmericas className="me-2 text-primary" />
                                        Country
                                    </span>
                                    <span className="gp-info-value">
                                        {guest.country || "Add country"}
                                    </span>
                                </div>

                                <div className="gp-info-row">
                                    <span className="gp-info-label">
                                        <FaCalendarAlt className="me-2 text-primary" />
                                        Member Since
                                    </span>
                                    <span className="gp-info-value">
                                        {guest.createdAt
                                            ? new Date(
                                                guest.createdAt
                                            ).toLocaleDateString()
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary Card */}
                        <div className="col-lg-6">
                            <div className="gp-card shadow-sm h-100">
                                <h5 className="gp-card-title mb-3">
                                    Booking Summary
                                </h5>

                                <div className="row g-3">
                                    <div className="col-12 col-sm-4">
                                        <div className="gp-stat-card">
                                            <div className="gp-stat-icon gp-stat-icon-blue">
                                                <FaBed />
                                            </div>
                                            <div className="gp-stat-label">
                                                Trips
                                            </div>
                                            <div className="gp-stat-value">
                                                {stats.totalBookings || 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <div className="gp-stat-card">
                                            <div className="gp-stat-icon gp-stat-icon-gold">
                                                <FaMoneyBillWave />
                                            </div>
                                            <div className="gp-stat-label">
                                                Spent
                                            </div>
                                            <div className="gp-stat-value">
                                                {formatCurrency(
                                                    stats.totalSpent || 0
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <div className="gp-stat-card">
                                            <div className="gp-stat-icon gp-stat-icon-gray">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="gp-stat-label">
                                                Last Stay
                                            </div>
                                            <div className="gp-stat-value gp-stat-small">
                                                {stats.lastStay
                                                    ? new Date(
                                                        stats.lastStay
                                                    ).toLocaleDateString()
                                                    : "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="gp-helper-text mt-3 mb-0">
                                    Want to see your full history? Check your{" "}
                                    <span className="fw-semibold">
                                        bookings page
                                    </span>{" "}
                                    for detailed receipts and itineraries.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
