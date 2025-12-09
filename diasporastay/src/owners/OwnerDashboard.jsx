import { useEffect, useState } from "react";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";
import { Link } from "react-router-dom";

import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    ArcElement
);

export default function OwnerDashboard() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({});
    const [monthly, setMonthly] = useState({});
    const [perHotel, setPerHotel] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("ownerToken");

                const res = await api.get("/api/owner/analytics/summary", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSummary(res.data);
                setMonthly(res.data.monthly || {});
                setPerHotel(res.data.perHotel || {});
            } catch (err) {
                console.error("Dashboard analytics error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading)
        return <OwnerLayout>Loading...</OwnerLayout>;

    // -------------------------
    // Monthly earnings chart
    // -------------------------
    const monthlyLabels = Object.keys(monthly);
    const monthlyValues = Object.values(monthly);

    const monthlyData = {
        labels: monthlyLabels,
        datasets: [
            {
                label: "Monthly Earnings ($)",
                data: monthlyValues,
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                tension: 0.3,
            },
        ],
    };

    // -------------------------
    // Per-hotel revenue chart
    // -------------------------
    const hotelNames = Object.keys(perHotel);
    const hotelEarnings = Object.values(perHotel);

    const perHotelData = {
        labels: hotelNames,
        datasets: [
            {
                label: "Earnings per Hotel ($)",
                data: hotelEarnings,
                backgroundColor: "#28a745",
            },
        ],
    };

    // -------------------------
    // Pie Chart - revenue breakdown
    // -------------------------
    const pieData = {
        labels: hotelNames,
        datasets: [
            {
                data: hotelEarnings,
                backgroundColor: [
                    "#007bff",
                    "#28a745",
                    "#ffc107",
                    "#17a2b8",
                    "#dc3545",
                    "#6f42c1",
                ],
                hoverOffset: 10,
            },
        ],
    };

    return (
        <OwnerLayout active="dashboard">
            {/* EDIT PROFILE BUTTON */}
            <div className="mb-3">
                <Link
                    to="/owner/edit-profile"
                    className="btn btn-warning"
                >
                    Edit Profile
                </Link>
            </div>

            {/* METRIC CARDS */}
            <div className="row g-3 mb-4">

                <div className="col-md-3 col-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">Total Revenue</p>
                            <h3 className="fw-bold">
                                ${summary.totalEarnings?.toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">Total Bookings</p>
                            <h3 className="fw-bold">
                                {summary.totalBookings}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">Upcoming Bookings</p>
                            <h3 className="fw-bold">
                                {summary.upcomingBookings}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">Hotels Managed</p>
                            <h3 className="fw-bold">
                                {hotelNames.length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="row g-4">

                {/* LEFT — Monthly Earnings Line Chart */}
                <div className="col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold">Monthly Earnings</h5>
                            <Line data={monthlyData} />
                        </div>
                    </div>
                </div>

                {/* RIGHT — Per-Hotel Bar Chart */}
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold">Earnings by Hotel</h5>
                            <Bar data={perHotelData} />
                        </div>
                    </div>
                </div>

                {/* PIE CHART */}
                <div className="col-lg-6 mt-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">
                                Earnings Breakdown (Pie)
                            </h5>
                            <Pie data={pieData} />
                        </div>
                    </div>
                </div>

            </div>
        </OwnerLayout>
    );
}
