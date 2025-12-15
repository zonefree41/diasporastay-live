import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerEarnings() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("ownerToken");

    useEffect(() => {
        loadEarnings();
    }, []);

    const loadEarnings = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/owner/earnings/summary`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSummary(res.data);
        } catch (err) {
            console.error("Failed to load earnings", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading earnings...</p>;

    // ✅ EMPTY STATE
    if (!summary || summary.totalEarnings === 0) {
        return (
            <div className="text-center py-5">
                <h4 className="mb-3">💰 No earnings yet</h4>
                <p className="text-muted">
                    Earnings will appear after your first confirmed booking.
                </p>
                <small className="text-muted">
                    DiasporaStay deducts a 12% platform fee.
                </small>
            </div>
        );
    }

    return (
        <div>
            <h4 className="mb-4">
                Earnings{" "}
                <span
                    title="Earnings shown are after a 12% platform fee"
                    style={{ cursor: "help" }}
                >
                    ℹ️
                </span>
            </h4>

            <div className="card p-4">
                <h3>${summary.totalEarnings.toFixed(2)}</h3>
                <p className="text-muted mb-0">
                    After 12% DiasporaStay platform fee
                </p>
            </div>
        </div>
    );
}
