// src/owners/OwnerAvailability.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";

export default function OwnerAvailability() {
    const { id } = useParams();

    const [dates, setDates] = useState([]); // unavailable dates
    const [dailyPrices, setDailyPrices] = useState({});
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ======================================================
       LOAD EXISTING AVAILABILITY
    ====================================================== */
    const loadAvailability = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            const res = await api.get(`/api/owner/hotels/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const hotel = res.data;

            setDates(
                hotel.unavailableDates?.map((d) =>
                    new Date(d).toISOString().split("T")[0]
                ) || []
            );

            setDailyPrices(hotel.dailyPrices || {});
            buildCalendar();
        } catch (err) {
            console.error("Load availability error:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    /* ======================================================
       BUILD NEXT 3 MONTHS
    ====================================================== */
    const buildCalendar = () => {
        const today = new Date();
        const temp = [];

        for (let m = 0; m < 3; m++) {
            let first = new Date(today.getFullYear(), today.getMonth() + m, 1);
            let last = new Date(today.getFullYear(), today.getMonth() + m + 1, 0);

            temp.push({
                name: first.toLocaleString("default", { month: "long" }),
                year: first.getFullYear(),
                days: Array.from({ length: last.getDate() }, (_, i) => {
                    const d = new Date(first.getFullYear(), first.getMonth(), i + 1);
                    return d.toISOString().split("T")[0];
                }),
            });
        }

        setMonths(temp);
    };

    /* ======================================================
       TOGGLE DATE AVAILABILITY
    ====================================================== */
    const toggleDate = (iso) => {
        let updated;

        if (dates.includes(iso)) {
            updated = dates.filter((d) => d !== iso);
        } else {
            updated = [...dates, iso];
        }

        setDates(updated);
    };

    /* ======================================================
       UPDATE DAILY PRICE
    ====================================================== */
    const updatePrice = (iso, value) => {
        setDailyPrices({
            ...dailyPrices,
            [iso]: value,
        });
    };

    /* ======================================================
       SAVE AVAILABILITY TO BACKEND
    ====================================================== */
    const saveAvailability = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            await api.post(
                `/api/owner/hotels/${id}/availability`,
                {
                    dates,
                    dailyPrices,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Availability updated!");
        } catch (err) {
            console.error("Save availability error:", err);
            alert("Failed to save availability.");
        }
    };

    /* ======================================================
       INIT LOAD
    ====================================================== */
    useEffect(() => {
        loadAvailability();
    }, []);

    if (loading) {
        return (
            <OwnerLayout>
                <p className="text-muted">Loading availability...</p>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout>
            <h3 className="fw-bold mb-3">Manage Availability</h3>

            <button
                className="btn btn-success mb-4 px-4"
                onClick={saveAvailability}
            >
                ✔ Save Availability
            </button>

            <div className="row g-4">
                {months.map((m, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div className="card shadow-sm">
                            <div className="card-header text-center fw-bold">
                                {m.name} {m.year}
                            </div>

                            <div className="card-body">
                                <div className="calendar-grid">
                                    {m.days.map((iso) => {
                                        const unavailable = dates.includes(iso);
                                        const price = dailyPrices[iso] || "";

                                        return (
                                            <div key={iso} className="calendar-cell">
                                                <button
                                                    className={`day-btn ${unavailable ? "unavailable" : "available"
                                                        }`}
                                                    onClick={() => toggleDate(iso)}
                                                >
                                                    {iso.split("-")[2]}
                                                </button>

                                                <input
                                                    type="number"
                                                    className="price-input"
                                                    placeholder="$"
                                                    value={price}
                                                    onChange={(e) =>
                                                        updatePrice(iso, e.target.value)
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ★ STYLES */}
            <style>{`
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                }
                .calendar-cell {
                    text-align: center;
                }
                .day-btn {
                    width: 35px;
                    height: 35px;
                    border-radius: 6px;
                    border: none;
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                .available {
                    background: #d4f8d4;
                    color: #0b640b;
                }
                .unavailable {
                    background: #ffd6d6;
                    color: #8a0000;
                }
                .price-input {
                    width: 100%;
                    font-size: 12px;
                    padding: 2px;
                    text-align: center;
                }
            `}</style>
        </OwnerLayout>
    );
}
