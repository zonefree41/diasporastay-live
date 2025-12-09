// src/owners/Availability.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import { useParams } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Availability() {
    const { id } = useParams();

    const [unavailable, setUnavailable] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Build calendar
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    // Load unavailable dates
    const loadAvailability = async () => {
        try {
            const res = await axios.get(`${API}/api/hotels/${id}`);
            setUnavailable(res.data.unavailableDates || []);
        } catch (err) {
            console.error("Load availability error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAvailability();
    }, []);

    // Convert hotel dates to yyyy-mm-dd
    const unavailableStr = unavailable.map((d) =>
        new Date(d).toISOString().substring(0, 10)
    );

    // Click date
    const toggleDate = (day) => {
        if (!day) return;

        const date = new Date(year, month, day).toISOString().substring(0, 10);

        setSelectedDates((prev) =>
            prev.includes(date)
                ? prev.filter((x) => x !== date)
                : [...prev, date]
        );
    };

    // Block dates
    const blockDates = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            await axios.post(
                `${API}/api/owner/hotels/${id}/block-dates`,
                { dates: selectedDates },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Dates blocked!");
            loadAvailability();
            setSelectedDates([]);
        } catch (err) {
            console.error("Block error:", err);
        }
    };

    // Unblock
    const unblockDates = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            await axios.post(
                `${API}/api/owner/hotels/${id}/unblock-dates`,
                { dates: selectedDates },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Dates unblocked!");
            loadAvailability();
            setSelectedDates([]);
        } catch (err) {
            console.error("Unblock error:", err);
        }
    };

    return (
        <OwnerLayout active="availability">
            <h3 className="fw-bold mb-4">Manage Availability</h3>

            {loading && <p>Loading...</p>}

            {/* Calendar */}
            <div className="calendar-container shadow-sm p-4 rounded-4 mb-4">
                <h5 className="fw-bold text-center mb-3">
                    {today.toLocaleString("default", { month: "long" })} {year}
                </h5>

                <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (d) => (
                            <div className="calendar-header">{d}</div>
                        )
                    )}

                    {days.map((day, idx) => {
                        if (!day)
                            return <div key={idx} className="calendar-empty"></div>;

                        const dateStr = new Date(
                            year,
                            month,
                            day
                        ).toISOString().substring(0, 10);

                        const isUnavailable = unavailableStr.includes(dateStr);
                        const isSelected = selectedDates.includes(dateStr);

                        return (
                            <div
                                key={idx}
                                className={`calendar-day 
                                    ${isUnavailable ? "unavailable" : ""}
                                    ${isSelected ? "selected" : ""}
                                `}
                                onClick={() => toggleDate(day)}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3">
                <button
                    className="btn btn-danger rounded-pill px-4"
                    onClick={blockDates}
                    disabled={selectedDates.length === 0}
                >
                    Block Dates
                </button>

                <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={unblockDates}
                    disabled={selectedDates.length === 0}
                >
                    Unblock Dates
                </button>
            </div>

            {/* Custom CSS */}
            <style>{`
                .calendar-container {
                    background: #fff;
                    border: 1px solid #eee;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                }
                .calendar-header {
                    font-weight: 600;
                    text-align: center;
                    padding: 6px;
                    opacity: 0.7;
                }
                .calendar-empty {
                    height: 45px;
                }
                .calendar-day {
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #f8f9fa;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                .calendar-day:hover {
                    background: #e9f2ff;
                    transform: translateY(-2px);
                }
                .calendar-day.unavailable {
                    background: #ffe3e3;
                    color: #c62828;
                    font-weight: 600;
                }
                .calendar-day.selected {
                    background: #007bff;
                    color: #fff;
                    font-weight: 600;
                }
            `}</style>
        </OwnerLayout>
    );
}
