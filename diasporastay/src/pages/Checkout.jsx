// src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();

    const { hotelId, checkIn, checkOut, totalPrice } = location.state || {};

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    // Load hotel details
    useEffect(() => {
        if (!hotelId) return;

        const loadHotel = async () => {
            try {
                const res = await api.get(`/api/hotels/${hotelId}`);
                setHotel(res.data);
            } catch (err) {
                console.error("Checkout load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
    }, [hotelId]);

    const updateField = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================================
    // CONFIRM BOOKING → STRIPE CHECKOUT
    // ================================
    const handleConfirmBooking = async () => {
        try {
            const guestId = localStorage.getItem("guestId");

            if (!guestId) {
                alert("You must be logged in to complete booking.");
                navigate("/guest/login");
                return;
            }

            // Calculate number of nights
            const nights = Math.ceil(
                (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
            );

            const payload = {
                hotelId,
                guestId,
                checkIn,
                checkOut,
                nights,
                totalPrice
            };

            // Start Stripe Checkout
            const res = await api.post(`/api/bookings/create-checkout`, payload);

            // Redirect to Stripe
            window.location.href = res.data.url;

        } catch (err) {
            console.error("Booking error:", err.response?.data || err);
            alert("Unable to start booking.");
        }
    };

    if (loading) return <div className="container py-5">Loading...</div>;

    return (
        <div className="container checkout-container py-5">
            <div className="row g-5">

                {/* LEFT SIDE – FORM */}
                <div className="col-lg-7">
                    <div className="checkout-card p-4">
                        <h3 className="fw-bold mb-3">Complete Your Booking</h3>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Full Name</label>
                            <input
                                name="fullName"
                                className="form-control premium-input"
                                value={form.fullName}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control premium-input"
                                value={form.email}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Phone Number</label>
                            <input
                                name="phone"
                                className="form-control premium-input"
                                value={form.phone}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <h5 className="fw-bold mb-2">Booking Details</h5>

                        <p className="checkout-detail">
                            <strong>Check-in:</strong> {checkIn}
                        </p>
                        <p className="checkout-detail">
                            <strong>Check-out:</strong> {checkOut}
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE – SUMMARY */}
                <div className="col-lg-5">
                    <div className="checkout-summary shadow-sm">
                        <img
                            src={hotel.images[0]}
                            className="summary-image"
                            alt="hotel"
                        />

                        <div className="summary-content p-4">
                            <h4 className="fw-bold mb-1">{hotel.name}</h4>
                            <p className="text-muted mb-2">
                                {hotel.city}, {hotel.country}
                            </p>

                            <hr />

                            <div className="d-flex justify-content-between mb-2">
                                <span>Room Price:</span>
                                <strong>${hotel.pricePerNight} / night</strong>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Total:</span>
                                <strong className="price-total">${totalPrice}</strong>
                            </div>

                            <button
                                className="btn btn-primary w-100 btn-lg mt-3 premium-book-btn"
                                onClick={handleConfirmBooking}
                            >
                                Confirm Booking & Pay
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
