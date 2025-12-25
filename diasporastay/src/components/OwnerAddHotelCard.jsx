import { useNavigate } from "react-router-dom";

export default function OwnerAddHotelCard({ next = "/owner/add-hotel" }) {
    const navigate = useNavigate();
    const ownerToken = localStorage.getItem("ownerToken");

    const go = () => {
        if (ownerToken) {
            navigate(next);
        } else {
            navigate(`/owner/login?next=${encodeURIComponent(next)}`);
        }
    };

    return (
        <div
            onClick={go}
            style={{
                border: "2px dashed #c7d2fe",
                borderRadius: 18,
                background: "#f8fafc",
                cursor: "pointer",
                minHeight: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 18,
                boxShadow: "0 10px 24px rgba(0,0,0,.06)",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && go()}
        >
            <div style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        background: "#2563eb",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 38,
                        fontWeight: 900,
                        marginBottom: 12,
                    }}
                >
                    +
                </div>

                <div style={{ fontWeight: 900, fontSize: 18 }}>
                    Add your hotel on DiasporaStay
                </div>

                <div style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>
                    Owners: list your property & start getting bookings.
                </div>

                <div
                    style={{
                        marginTop: 12,
                        display: "inline-block",
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: "#111827",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 13,
                    }}
                >
                    Continue →
                </div>
            </div>
        </div>
    );
}
