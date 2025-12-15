// src/pages/BookingCancel.jsx
import { Link } from "react-router-dom";

export default function BookingCancel() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="text-center">
                <h2 className="fw-bold text-danger mb-3">Payment Cancelled</h2>
                <p className="text-muted mb-4">
                    Your payment was cancelled. No charges have been made.
                </p>

                <Link to="/" className="btn btn-primary">
                    Return Home
                </Link>
            </div>
        </div>
    );
}
