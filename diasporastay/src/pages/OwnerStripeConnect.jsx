import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerStripeConnect() {
    const [loading, setLoading] = useState(true);
    const [ready, setReady] = useState(false);

    const token = localStorage.getItem("ownerToken");

    console.log("🔍 API BASE URL:", import.meta.env.VITE_API_URL);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const res = await api.get("/api/owner/stripe/connect/status");
            setReady(res.data.ready);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const connectStripe = async () => {
        console.log("🔔 Connect Stripe button clicked");

        try {
            console.log("➡️ Calling create-account");

            await api.post("/api/owner/stripe/connect/create-account");

            console.log("➡️ Calling onboarding-link");

            const res = await api.post(
                "/api/owner/stripe/connect/onboarding-link"
            );

            console.log("➡️ Redirecting to Stripe:", res.data.url);

            window.location.href = res.data.url;
        } catch (err) {
            console.error("❌ Stripe connect error:", err.response?.data || err);
            alert("Stripe connection failed — check console");
        }
    };

    if (loading) return <p>Loading Stripe status...</p>;

    return (
        <div className="container mt-5">
            <h2>💳 Payout Settings</h2>

            {ready ? (
                <div className="alert alert-success mt-3">
                    ✅ Stripe connected — payouts enabled
                </div>
            ) : (
                <div className="card p-4 mt-3">
                    <p>
                        To receive booking payouts, connect your Stripe account.
                        DiasporaStay keeps a 12% platform fee automatically.
                    </p>

                    <button className="btn btn-primary" onClick={connectStripe}>
                        Connect Stripe
                    </button>
                </div>
            )}
        </div>
    );
}
