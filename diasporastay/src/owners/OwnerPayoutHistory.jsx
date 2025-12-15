import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerPayoutHistory() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("ownerToken");

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
    });

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await api.get("/api/owner/payouts/history");
            setRows(res.data);
        } catch (err) {
            console.error("❌ Failed to load payout history", err);
            alert("Failed to load payout history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="mt-5 text-center">Loading payout history…</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">💸 Payout History</h2>

            {rows.length === 0 ? (
                <div className="alert alert-info">
                    No payouts yet. Paid bookings will appear here.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Hotel</th>
                                <th>USD</th>
                                <th>ETB</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th>Paid At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.bookingId}>
                                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                    <td>{r.hotelName}</td>
                                    <td>${r.ownerEarningsUSD}</td>
                                    <td>{r.ownerEarningsETB ? `${r.ownerEarningsETB} ETB` : "—"}</td>
                                    <td>
                                        <span
                                            className={`badge ${r.payoutStatus === "paid" ? "bg-success" : "bg-warning"
                                                }`}
                                        >
                                            {r.payoutStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{r.payoutMethod || "—"}</td>
                                    <td>{r.paidAt ? new Date(r.paidAt).toLocaleDateString() : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
