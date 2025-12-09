// src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import api from "../axios";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios
            .get(`${API}/api/bookings`)
            .then((res) => setBookings(res.data))
            .catch((err) => console.log("Bookings fetch error:", err));
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4">My Bookings</h2>

            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <div className="list-group">
                    {bookings.map((b) => (
                        <div key={b._id} className="list-group-item mb-2">
                            <h5>Hotel: {b.hotelName || b.hotelId}</h5>
                            <p>
                                <strong>Check-in:</strong> {new Date(b.checkIn).toDateString()}
                            </p>
                            <p>
                                <strong>Check-out:</strong> {new Date(b.checkOut).toDateString()}
                            </p>
                            <p>
                                <strong>Total Price:</strong> ${b.totalPrice}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
