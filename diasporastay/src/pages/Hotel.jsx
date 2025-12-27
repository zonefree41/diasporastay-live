// src/pages/Hotel.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ======================
   DATE HELPERS
====================== */
const today = new Date();
today.setHours(0, 0, 0, 0);

const isSameDay = (a, b) =>
    a && b && a.toDateString() === b.toDateString();

const daysInMonth = (year, month) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    return days;
};

export default function Hotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);

    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [nights, setNights] = useState(0);
    const [total, setTotal] = useState(0);

    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const days = daysInMonth(year, month);

    /* ======================
       LOAD HOTEL
    ====================== */
    useEffect(() => {
        const loadHotel = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/hotels/${id}`
                );

                if (!res.ok) {
                    throw new Error("Hotel not found");
                }

                const data = await res.json();
                setHotel(data);
            } catch (err) {
                console.error("HOTEL LOAD ERROR:", err.message);
            }
        };

        loadHotel();
    }, [id]);

    /* ======================
       LOAD AVAILABILITY
    ====================== */
    useEffect(() => {
        if (!hotel) return;

        setBlockedDates(
            (hotel.blockedDates || []).map((d) => new Date(d))
        );
    }, [hotel]);

    /* ======================
       CALCULATE TOTAL
    ====================== */
    useEffect(() => {
        if (checkIn && checkOut && hotel) {
            const diff =
                (checkOut.getTime() - checkIn.getTime()) /
                (1000 * 60 * 60 * 24);

            if (diff > 0) {
                setNights(diff);
                setTotal(diff * hotel.pricePerNight);
            } else {
                setNights(0);
                setTotal(0);
            }
        }
    }, [checkIn, checkOut, hotel]);

    /* ======================
       AVAILABILITY
    ====================== */
    const isBlocked = (date) =>
        blockedDates.some((d) => isSameDay(d, date));

    const rangeHasBlocked = (start, end) => {
        for (
            let d = new Date(start);
            d < end;
            d.setDate(d.getDate() + 1)
        ) {
            if (isBlocked(d)) return true;
        }
        return false;
    };

    /* ======================
       SELECT DATE
    ====================== */
    const selectDate = (date) => {
        if (!date || date < today || isBlocked(date)) return;

        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(date);
            setCheckOut(null);
            setTotal(0);
            setNights(0);
        } else if (date > checkIn) {
            if (rangeHasBlocked(checkIn, date)) {
                alert("Selected range contains unavailable dates");
                return;
            }
            setCheckOut(date);
        }
    };

    /* ======================
       STRIPE RESERVE
    ====================== */
    const handleReserve = async () => {
        const token = localStorage.getItem("guestToken");

        if (!token) {
            navigate("/guest/login");
            return;
        }

        if (!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates");
            return;
        }

        const diff =
            (checkOut.getTime() - checkIn.getTime()) /
            (1000 * 60 * 60 * 24);

        if (diff <= 0) {
            alert("Invalid date range");
            return;
        }

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/bookings/create-checkout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotelId: hotel._id,
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Booking failed");
            return;
        }

        window.location.href = data.url;
    };

    if (!hotel) return <p style={{ padding: 40 }}>Loading…</p>;

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto", padding: 20 }}>
            <h1>{hotel.name}</h1>
            <p>{hotel.city}, {hotel.country}</p>

            <h2 style={{ marginTop: 20 }}>
                ${hotel.pricePerNight} <span style={{ fontSize: 14 }}>/ night</span>
            </h2>

            {/* CALENDAR */}
            <div style={{ marginTop: 30 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={() => setMonth((m) => m - 1)}>‹</button>
                    <strong>
                        {new Date(year, month).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </strong>
                    <button onClick={() => setMonth((m) => m + 1)}>›</button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: 6,
                        marginTop: 10,
                    }}
                >
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i}>{d}</div>
                    ))}

                    {days.map((date, i) => {
                        if (!date) return <div key={i} />;

                        const disabled = date < today || isBlocked(date);
                        const selected =
                            isSameDay(date, checkIn) || isSameDay(date, checkOut);

                        return (
                            <div
                                key={i}
                                onClick={() => selectDate(date)}
                                style={{
                                    height: 42,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    background: isBlocked(date)
                                        ? "#fee2e2"
                                        : selected
                                            ? "#2563eb"
                                            : "transparent",
                                    color: isBlocked(date)
                                        ? "#991b1b"
                                        : selected
                                            ? "#fff"
                                            : "#111",
                                }}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TOTAL */}
            <div style={{ marginTop: 20, fontSize: 18 }}>
                Total: <strong>${total}</strong>
            </div>

            <button
                onClick={handleReserve}
                style={{
                    marginTop: 20,
                    padding: 14,
                    width: "100%",
                    borderRadius: 12,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                }}
            >
                Reserve
            </button>
        </div>
    );
}
