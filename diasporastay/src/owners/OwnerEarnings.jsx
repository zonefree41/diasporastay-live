// src/owners/OwnerEarnings.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";

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

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function OwnerEarnings() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({});
    const [monthly, setMonthly] = useState({});
    const [perHotel, setPerHotel] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("ownerToken");

                const res = await axios.get(
                    `${API}/api/owner/analytics/summary`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setSummary(res.data);
                setMonthly(res.data.monthly || {});
                setPerHotel(res.data.perHotel || {});
            } catch (err) {
                console.error("Earnings load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <OwnerLayout>Loading earnings...</OwnerLayout>;

    const monthlyLabels = Object.keys(monthly);
    const monthlyValues = Object.values(monthly);

    const monthlyData = {
        labels: monthlyLabels,
        datasets: [
            {
                label: "Monthly Revenue",
                data: monthlyValues,
                borderColor: "#4e8cff",
                backgroundColor: "rgba(78, 140, 255, 0.25)",
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: "#4e8cff",
                tension: 0.35,
            },
        ],
    };

    const hotelNames = Object.keys(perHotel);
    const hotelValues = Object.values(perHotel);

    const hotelBarData = {
        labels: hotelNames,
        datasets: [
            {
                label: "Revenue",
                data: hotelValues,
                backgroundColor: "rgba(0, 175, 115, 0.85)",
                borderRadius: 8,
            },
        ],
    };

    const pieData = {
        labels: hotelNames,
        datasets: [
            {
                data: hotelValues,
                backgroundColor: [
                    "#4e8cff",
                    "#00b894",
                    "#fab005",
                    "#d63031",
                    "#7950f2",
                    "#0984e3",
                ],
                hoverOffset: 10,
            },
        ],
    };

    return (
        <OwnerLayout active="earnings">
            <h3 className="fw-bold mb-4">Earnings Overview</h3>

            {/* TOP STAT CARDS */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="earn-card shadow-sm">
                        <p className="text-muted mb-1">Total Revenue</p>
                        <h2 className="fw-bold text-primary">
                            ${summary.totalEarnings?.toFixed(2) || 0}
                        </h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="earn-card shadow-sm">
                        <p className="text-muted mb-1">Total Bookings</p>
                        <h2 className="fw-bold text-success">
                            {summary.totalBookings || 0}
                        </h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="earn-card shadow-sm">
                        <p className="text-muted mb-1">Hotels Managed</p>
                        <h2 className="fw-bold text-info">
                            {hotelNames.length}
                        </h2>
                    </div>
                </div>
            </div>

            {/* CHARTS */}
            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="chart-box shadow-sm">
                        <h5 className="fw-bold mb-3">Monthly Revenue Trend</h5>
                        <Line data={monthlyData} />
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="chart-box shadow-sm">
                        <h5 className="fw-bold mb-3">Revenue by Property</h5>
                        <Bar data={hotelBarData} />
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="chart-box shadow-sm">
                        <h5 className="fw-bold mb-3">Revenue Distribution</h5>
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>

            {/* CUSTOM CSS */}
            <style>{`
                .earn-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    transition: all .25s ease;
                }
                .earn-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 22px rgba(0,0,0,0.1);
                }

                .chart-box {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                }

                .chart-box:hover {
                    box-shadow: 0 8px 18px rgba(0,0,0,0.08);
                }
            `}</style>
        </OwnerLayout>
    );
}
