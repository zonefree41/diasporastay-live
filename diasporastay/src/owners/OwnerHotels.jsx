// src/owners/OwnerHotels.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function OwnerHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHotels = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            const res = await axios.get(`${API}/api/owner/hotels`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setHotels(res.data);
        } catch (err) {
            console.error("Load owner hotels error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHotels();
    }, []);

    return (
        <OwnerLayout active="hotels">
            <h3 className="fw-bold mb-4">My Hotels</h3>

            {loading && <p className="text-muted">Loading hotels...</p>}

            {!loading && hotels.length === 0 && (
                <p className="text-muted">No hotels yet. Add one!</p>
            )}

            <div className="row g-4">
                {hotels.map((hotel) => (
                    <div className="col-md-4" key={hotel._id}>
                        <div className="card hotel-card shadow-sm border-0 h-100">
                            <div className="hotel-img-wrapper">
                                <img
                                    src={hotel.images?.[0]}
                                    className="hotel-img"
                                    alt={hotel.name}
                                />
                            </div>

                            <div className="card-body d-flex flex-column">
                                <h5 className="fw-bold mb-1">{hotel.name}</h5>
                                <p className="text-muted mb-1">
                                    {hotel.city}, {hotel.country}
                                </p>

                                <p className="fw-semibold text-primary mb-3">
                                    ${hotel.pricePerNight}/night
                                </p>

                                <div className="mt-auto d-flex flex-column gap-2">
                                    <Link
                                        to={`/owner/hotels/${hotel._id}/edit`}
                                        className="btn btn-primary btn-sm rounded-pill"
                                    >
                                        ✏ Edit Hotel
                                    </Link>

                                    <Link
                                        to={`/owner/hotels/${hotel._id}/availability`}
                                        className="btn btn-outline-secondary btn-sm rounded-pill"
                                    >
                                        📅 Manage Availability
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 Custom CSS */}
            <style>{`
                .hotel-card {
                    transition: all 0.25s ease;
                    border-radius: 16px;
                    overflow: hidden;
                }
                .hotel-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                }

                .hotel-img-wrapper {
                    height: 170px;
                    overflow: hidden;
                }

                .hotel-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.35s ease;
                }

                .hotel-card:hover .hotel-img {
                    transform: scale(1.08);
                }
            `}</style>
        </OwnerLayout>
    );
}
