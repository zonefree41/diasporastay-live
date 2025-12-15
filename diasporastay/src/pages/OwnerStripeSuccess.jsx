import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OwnerStripeSuccess() {
    const navigate = useNavigate();
    const token = localStorage.getItem("ownerToken");

    useEffect(() => {
        const confirmStripeStatus = async () => {
            try {
                await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/owner/stripe/connect/status`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (err) {
                console.error("Stripe status check failed", err);
            }

            // ⏳ short delay then redirect
            setTimeout(() => {
                navigate("/owner/dashboard");
            }, 2000);
        };

        confirmStripeStatus();
    }, [navigate, token]);

    return (
        <div className="container text-center mt-5">
            <h2>🎉 Stripe Connected Successfully</h2>
            <p>Your payout account is now set up.</p>
            <p>Redirecting to your dashboard…</p>
        </div>
    );
}
