// src/owners/Availability.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const getDaysInMonthGrid = (year, month) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days = [];
    const gap = first.getDay(); // 0 Sun..6 Sat

    for (let i = 0; i < gap; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    return days;
};

export default function Availability() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("ownerToken");

    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [blocked, setBlocked] = useState(new Set()); // Set of "YYYY-MM-DD"
    const [hotelName, setHotelName] = useState("");

    const today = useMemo(() => startOfDay(new Date()), []);
    const days = useMemo(() => getDaysInMonthGrid(year, month), [year, month]);

    useEffect(() => {
        if (!token) {
            navigate("/owner/login");
            return;
        }

        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/owner/hotels/${id}/availability`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to load availability");

                // expected: { blockedDates: [...], hotelName? }
                const list = Array.isArray(data.blockedDates) ? data.blockedDates : (Array.isArray(data) ? data : []);
                const set = new Set(list.map((d) => ymd(d)));
                setBlocked(set);
                if (data.hotelName) setHotelName(data.hotelName);
            } catch (e) {
                alert(e.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, token, navigate]);

    const toggleDay = (dateObj) => {
        if (!dateObj) return;
        const d = startOfDay(dateObj);
        if (d < today) return; // past disabled

        const key = ymd(d);
        setBlocked((prev) => {
            const copy = new Set(prev);
            if (copy.has(key)) copy.delete(key);
            else copy.add(key);
            return copy;
        });
    };

    const goPrev = () => {
        const m = month - 1;
        if (m < 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else setMonth(m);
    };

    const goNext = () => {
        const m = month + 1;
        if (m > 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else setMonth(m);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const blockedDates = Array.from(blocked).sort();

            const res = await fetch(`/api/owner/hotels/${id}/availability`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ blockedDates }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Save failed");

            alert("Availability saved ✅");
        } catch (e) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{ padding: 40 }}>Loading…</p>;

    return (
        <div style={page}>
            <div style={topBar}>
                <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
                <div>
                    <div style={title}>Availability</div>
                    {!!hotelName && <div style={subtitle}>{hotelName}</div>}
                </div>
                <button onClick={handleSave} disabled={saving} style={saveBtn}>
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>

            <div style={card}>
                <div style={monthRow}>
                    <button onClick={goPrev} style={navBtn}>‹</button>

                    <div style={{ fontWeight: 900 }}>
                        {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
                    </div>

                    <button onClick={goNext} style={navBtn}>›</button>
                </div>

                <div style={weekRow}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((w) => (
                        <div key={w} style={weekDay}>{w}</div>
                    ))}
                </div>

                <div style={grid}>
                    {days.map((d, idx) => {
                        if (!d) return <div key={idx} />;

                        const isPast = startOfDay(d) < today;
                        const key = ymd(d);
                        const isBlocked = blocked.has(key);

                        return (
                            <button
                                key={idx}
                                onClick={() => toggleDay(d)}
                                disabled={isPast}
                                style={{
                                    ...dayBtn,
                                    background: isBlocked ? "#fee2e2" : "#fff",
                                    borderColor: isBlocked ? "#fecaca" : "#e5e7eb",
                                    color: isPast ? "#cbd5e1" : "#111827",
                                    opacity: isPast ? 0.55 : 1,
                                }}
                                title={isBlocked ? "Blocked" : "Available"}
                            >
                                <div style={{ fontWeight: 900 }}>{d.getDate()}</div>
                                <div style={{ fontSize: 10, marginTop: 4, fontWeight: 800, color: isBlocked ? "#991b1b" : "#16a34a" }}>
                                    {isBlocked ? "Blocked" : "Open"}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div style={legend}>
                    <span><span style={{ ...dot, background: "#fee2e2", borderColor: "#fecaca" }} /> Blocked</span>
                    <span><span style={{ ...dot, background: "#fff", borderColor: "#e5e7eb" }} /> Available</span>
                    <span><span style={{ ...dot, background: "#f1f5f9", borderColor: "#e2e8f0" }} /> Past disabled</span>
                </div>
            </div>
        </div>
    );
}

/* styles */
const page = { maxWidth: 980, margin: "40px auto", padding: 16 };
const topBar = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 };
const backBtn = { border: "1px solid #e5e7eb", background: "#fff", padding: "10px 12px", borderRadius: 12, fontWeight: 900, cursor: "pointer" };
const saveBtn = { border: "none", background: "#2563eb", color: "#fff", padding: "10px 14px", borderRadius: 12, fontWeight: 900, cursor: "pointer" };
const title = { fontSize: 22, fontWeight: 900 };
const subtitle = { fontSize: 13, color: "#6b7280", marginTop: 2 };

const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 16, boxShadow: "0 12px 28px rgba(0,0,0,.08)" };
const monthRow = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 };
const navBtn = { border: "1px solid #e5e7eb", background: "#fff", width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontWeight: 900 };

const weekRow = { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 };
const weekDay = { textAlign: "center", fontSize: 12, color: "#6b7280", fontWeight: 900 };

const grid = { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 };
const dayBtn = {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "10px 0",
    background: "#fff",
    cursor: "pointer",
    minHeight: 62,
};

const legend = { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 12, fontSize: 12, color: "#374151", flexWrap: "wrap" };
const dot = { display: "inline-block", width: 12, height: 12, borderRadius: 4, border: "1px solid #e5e7eb", marginRight: 8 };
