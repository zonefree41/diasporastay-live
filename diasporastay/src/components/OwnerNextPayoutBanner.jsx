import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerNextPayoutBanner() {
    const [info, setInfo] = useState(null);
    const token = localStorage.getItem("ownerToken");

    useEffect(() => {
        loadInfo();
    }, []);

    const loadInfo = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/owner/payout-info/next-payout`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInfo(res.data);
        } catch (err) {
            console.error("❌ Failed to load payout info", err);
        }
    };

    if (!info) return null;

    return (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
            <div>
                <strong>💸 Next payout:</strong>{" "}
                {new Date(info.nextPayoutDate).toLocaleDateString()}
                <br />
                <small className="text-muted">{info.message}</small>
            </div>
        </div>
    );
}
