import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function OwnerDashboard() {
    const [loading, setLoading] = useState(true);
    const [stripeReady, setStripeReady] = useState(false);
    const [earnings, setEarnings] = useState(null);

    const token = localStorage.getItem("ownerToken");
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // 1️⃣ Stripe status
                const stripeRes = await axios.get(
                    `${API}/api/owner/stripe/connect/status`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setStripeReady(stripeRes.data.ready);

                // 2️⃣ Earnings (only if stripe is connected)
                const earningsRes = await axios.get(
                    `${API}/api/owner/earnings/monthly`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setEarnings(earningsRes.data);
            } catch (err) {
                console.error("Owner dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [API, token]);

    if (loading) {
        return (
            <div className="container mt-5">
                <h4>Loading dashboard…</h4>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🏨 Owner Dashboard</h2>

                {stripeReady ? (
                    <span className="badge bg-success fs-6">
                        ✅ Stripe Connected
                    </span>
                ) : (
                    <span className="badge bg-warning text-dark fs-6">
                        ⚠️ Stripe Not Connected
                    </span>
                )}
            </div>

            {/* STRIPE WARNING */}
            {!stripeReady && (
                <div className="alert alert-warning">
                    <strong>Action required:</strong>
                    <br />
                    To receive bookings and payouts, you must connect your Stripe account.
                    <br />
                    <Link to="/owner/stripe" className="btn btn-primary btn-sm mt-2">
                        Connect Stripe
                    </Link>
                </div>
            )}

            {/* DASHBOARD CARDS */}
            <div className="row">
                {/* MY HOTELS */}
                <div className="col-md-4 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5>🏨 My Hotels</h5>
                            <p className="text-muted">
                                View and manage your listed hotels.
                            </p>
                            <Link
                                to="/owner/hotels"
                                className="btn btn-outline-primary btn-sm"
                            >
                                Manage Hotels
                            </Link>
                        </div>
                    </div>
                </div>

                {/* BOOKINGS */}
                <div className="col-md-4 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5>📅 Bookings</h5>
                            <p className="text-muted">
                                See guest bookings and stay details.
                            </p>
                            <Link
                                to="/owner/bookings"
                                className={`btn btn-outline-primary btn-sm ${!stripeReady ? "disabled" : ""
                                    }`}
                            >
                                View Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                {/* EARNINGS */}
                <div className="col-md-4 mb-3">
                    <div className="card h-100 border-success">
                        <div className="card-body">
                            <h5>💰 Earnings (This Month)</h5>

                            {earnings ? (
                                <>
                                    <h3 className="text-success">
                                        ${earnings.net}
                                    </h3>
                                    <small className="text-muted">
                                        {earnings.bookingsCount} bookings · 12% platform fee
                                    </small>
                                </>
                            ) : (
                                <p className="text-muted">No earnings yet</p>
                            )}

                            <div className="mt-3">
                                <Link
                                    to="/owner/earnings"
                                    className={`btn btn-outline-success btn-sm ${!stripeReady ? "disabled" : ""
                                        }`}
                                >
                                    View Earnings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER NOTE */}
            <div className="mt-5 text-muted">
                DiasporaStay automatically deducts a{" "}
                <strong>12% platform fee</strong>.
                Payouts are handled securely through Stripe.
            </div>
        </div>
    );
}
