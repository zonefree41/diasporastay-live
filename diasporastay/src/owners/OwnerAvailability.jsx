// src/owners/OwnerAvailability.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";

export default function OwnerAvailability() {
    const { id } = useParams();

    const [blockedDates, setBlockedDates] = useState([]);
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /* ======================================================
       LOAD AVAILABILITY FROM BACKEND
    ====================================================== */
    const loadAvailability = async () => {
        try {
            const { data } = await api.get(
                `/api/owner/hotels/${id}/availability`
            );

            const parsedDates =
                data.blockedDates?.map((d) =>
                    new Date(d).toISOString().split("T")[0]
                ) || [];

            setBlockedDates(parsedDates);
        } catch (err) {
            console.error("LOAD AVAILABILITY ERROR:", err.response?.data || err);
            alert("Failed to load availability.");
        } finally {
            setLoading(false);
        }
    };

    /* ======================================================
       BUILD NEXT 3 MONTHS CALENDAR
    ====================================================== */
    const buildCalendar = () => {
        const today = new Date();
        const temp = [];

        for (let m = 0; m < 3; m++) {
            const first = new Date(today.getFullYear(), today.getMonth() + m, 1);
            const last = new Date(today.getFullYear(), today.getMonth() + m + 1, 0);

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
       TOGGLE DATE
    ====================================================== */
    const toggleDate = (iso) => {
        setBlockedDates((prev) =>
            prev.includes(iso)
                ? prev.filter((d) => d !== iso)
                : [...prev, iso]
        );
    };

    /* ======================================================
       SAVE AVAILABILITY
    ====================================================== */
    const saveAvailability = async () => {
        setSaving(true);
        try {
            await api.put(`/api/owner/hotels/${id}/availability`, {
                blockedDates,
            });

            alert("Availability updated successfully");
        } catch (err) {
            console.error("SAVE AVAILABILITY ERROR:", err.response?.data || err);
            alert("Failed to save availability.");
        } finally {
            setSaving(false);
        }
    };

    /* ======================================================
       INIT
    ====================================================== */
    useEffect(() => {
        loadAvailability();
    }, [id]);

    useEffect(() => {
        buildCalendar();
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
                disabled={saving}
            >
                {saving ? "Saving..." : "✔ Save Availability"}
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
                                        const isBlocked = blockedDates.includes(iso);

                                        return (
                                            <button
                                                key={iso}
                                                className={`day-btn ${isBlocked ? "unavailable" : "available"
                                                    }`}
                                                onClick={() => toggleDate(iso)}
                                            >
                                                {iso.split("-")[2]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= STYLES ================= */}
            <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .day-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          font-weight: bold;
          cursor: pointer;
        }
        .available {
          background: #dcfce7;
          color: #166534;
        }
        .unavailable {
          background: #fee2e2;
          color: #991b1b;
        }
      `}</style>
        </OwnerLayout>
    );
}
