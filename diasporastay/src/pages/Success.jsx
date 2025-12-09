// src/pages/Success.jsx
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="success-wrapper d-flex align-items-center justify-content-center">
      <div className="success-card text-center">

        <div className="checkmark-container">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        <h2 className="fw-bold mt-4">Booking Confirmed! 🎉</h2>

        <p className="text-muted mb-4">
          Your reservation is successfully completed.  
          A confirmation email has been sent to you.
        </p>

        <div className="d-flex gap-3 justify-content-center mt-3">

          <Link to="/" className="btn home-btn">
            Go Home
          </Link>

          <Link to="/my-bookings" className="btn bookings-btn">
            View My Bookings
          </Link>

        </div>
      </div>
    </div>
  );
}
