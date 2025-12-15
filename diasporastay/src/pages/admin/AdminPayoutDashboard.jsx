import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPayoutDashboard() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const adminToken = localStorage.getItem("adminToken");

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
        headers: {
            Authorization: `Bearer ${adminToken}`,
        },
    });

    useEffect(() => {
        loadPayouts();
    }, []);

    const loadPayouts = async () => {
        try {
            const res = await api.get("/api/admin/payouts/pending");
            setPayouts(res.data);
        } catch (err) {
            console.error("❌ Failed to load payouts", err);
            alert("Failed to load payouts");
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async (bookingId, payoutMethod) => {
        if (!payoutMethod) {
            alert("Please select payout method");
            return;
        }

        setProcessingId(bookingId);

        try {
            await api.post("/api/admin/payouts/mark-paid", {
                bookingId,
                payoutMethod,
            });

            setPayouts((prev) =>
                prev.filter((p) => p.bookingId !== bookingId)
            );
        } catch (err) {
            console.error("❌ Mark payout failed", err);
            alert("Failed to mark payout");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading payouts…</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">💸 Pending Owner Payouts</h2>

            {payouts.length === 0 ? (
                <div className="alert alert-success">
                    🎉 No pending payouts
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Hotel</th>
                                <th>Owner</th>
                                <th>Country</th>
                                <th>USD</th>
                                <th>ETB</th>
                                <th>Payout Method</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payouts.map((p) => (
                                <tr key={p.bookingId}>
                                    <td>{p.hotelName}</td>

                                    <td>
                                        {p.owner?.name}
                                        <br />
                                        <small>{p.owner?.email}</small>
                                    </td>

                                    <td>{p.owner?.country || "—"}</td>

                                    <td>${p.ownerEarningsUSD}</td>

                                    <td>
                                        {p.ownerEarningsETB
                                            ? `${p.ownerEarningsETB} ETB`
                                            : "—"}
                                    </td>

                                    <td>
                                        <select
                                            className="form-select"
                                            defaultValue=""
                                            disabled={processingId === p.bookingId}
                                            onChange={(e) =>
                                                (p.selectedMethod = e.target.value)
                                            }
                                        >
                                            <option value="">Select</option>
                                            <option value="stripe">Stripe</option>
                                            <option value="manual_bank">Bank Transfer</option>
                                            <option value="cash">Cash</option>
                                            <option value="mobile_money">Mobile Money</option>
                                        </select>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            disabled={processingId === p.bookingId}
                                            onClick={() =>
                                                markAsPaid(
                                                    p.bookingId,
                                                    p.selectedMethod
                                                )
                                            }
                                        >
                                            {processingId === p.bookingId
                                                ? "Processing…"
                                                : "Mark Paid"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
