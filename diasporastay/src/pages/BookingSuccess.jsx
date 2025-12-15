// src/pages/BookingSuccess.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../axios";

export default function BookingSuccess() {
    const [params] = useSearchParams();
    const bookingId = params.get("bookingId");

    const [booking, setBooking] = useState(null);

    const loadBooking = async () => {
        try {
            const res = await api.get(`/api/bookings/${bookingId}`);
            setBooking(res.data);
        } catch (err) {
            console.error("❌ Booking load error:", err);
        }
    };

    useEffect(() => {
        if (bookingId) loadBooking();
    }, [bookingId]);

    return (
        <div className="container d-flex justify-content-center py-5">
            <div className="success-card text-center p-4 shadow-lg">

                {/* CHECKMARK */}
                <div className="checkmark-circle mx-auto mb-3">
                    <div className="checkmark"></div>
                </div>

                <h2 className="fw-bold">Booking Confirmed!</h2>

                <p className="text-muted mb-3">
                    Thank you — your stay is officially booked.
                </p>

                {booking && (
                    <>
                        <h4 className="fw-semibold">{booking.hotelSnapshot.name}</h4>
                        <p className="text-muted">
                            {booking.hotelSnapshot.city}, {booking.hotelSnapshot.country}
                        </p>

                        <p>
                            <strong>Check-in:</strong> {booking.checkIn.slice(0, 10)}<br />
                            <strong>Check-out:</strong> {booking.checkOut.slice(0, 10)}
                        </p>

                        <h4 className="fw-bold text-success">
                            Total Paid: ${booking.totalPrice}
                        </h4>
                    </>
                )}

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Link className="btn btn-primary" to="/my-bookings">
                        View My Bookings
                    </Link>
                    <Link className="btn btn-outline-secondary" to="/">
                        Home
                    </Link>
                </div>
            </div>

            <style>{`
                .success-card { width: 420px; border-radius: 16px; }
                .checkmark-circle {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    background: #d1f7d6;
                    display: flex; align-items: center; justify-content: center;
                }
                .checkmark {
                    width: 30px; height: 15px;
                    border-left: 4px solid green;
                    border-bottom: 4px solid green;
                    transform: rotate(-45deg);
                }
            `}</style>
        </div>
    );
}
