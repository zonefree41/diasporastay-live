// src/pages/OwnerDashboard.jsx
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: 1100, margin: "40px auto", padding: 20 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700 }}>
                Owner Dashboard
            </h1>

            <p style={{ color: "#6b7280", marginTop: 6 }}>
                Manage your hotels, bookings, and earnings
            </p>

            {/* ACTION CARDS */}
            <div
                style={{
                    marginTop: 40,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                }}
            >
                {/* MY HOTELS */}
                <DashboardCard
                    title="My Hotels"
                    description="View and manage your listed hotels"
                    onClick={() => navigate("/owner/my-hotels")}
                />

                {/* ADD HOTEL */}
                <DashboardCard
                    title="Add Hotel"
                    description="Create a new hotel listing"
                    onClick={() => navigate("/owner/add-hotel")}
                    highlight
                />

                {/* BOOKINGS */}
                <DashboardCard
                    title="Bookings"
                    description="See guest reservations"
                    onClick={() => navigate("/owner/bookings")}
                />

                {/* EARNINGS */}
                <DashboardCard
                    title="Earnings"
                    description="Track your income"
                    onClick={() => navigate("/owner/earnings")}
                />
            </div>
        </div>
    );
}

/* =========================
   DASHBOARD CARD
========================= */
function DashboardCard({ title, description, onClick, highlight }) {
    return (
        <div
            onClick={onClick}
            style={{
                cursor: "pointer",
                padding: 24,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                background: highlight ? "#2563eb" : "#fff",
                color: highlight ? "#fff" : "#111",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>
                {title}
            </h3>
            <p
                style={{
                    marginTop: 8,
                    color: highlight ? "#e0e7ff" : "#6b7280",
                }}
            >
                {description}
            </p>
        </div>
    );
}
