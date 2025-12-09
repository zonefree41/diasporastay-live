import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";

export default function Hotel() {
    const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";
    const { id } = useParams();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeImg, setActiveImg] = useState(0); // gallery

    useEffect(() => {
        const loadHotel = async () => {
            try {
                const res = await axios.get(`${API}/api/hotels/${id}`);
                setHotel(res.data);
            } catch (err) {
                console.error("Hotel fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
    }, [id]);

    if (loading) return <div className="page-loading">Loading hotel...</div>;
    if (!hotel) return <div className="page-loading">Hotel not found.</div>;

    return (
        <div className="page-section fade-in">
            <div className="container" style={{ maxWidth: "1200px" }}>

                {/* HOTEL NAME & LOCATION */}
                <div className="mb-4">
                    <h1 className="fw-bold">{hotel.name}</h1>
                    <p className="text-muted">{hotel.city}, {hotel.country}</p>
                </div>

                {/* IMAGE GALLERY */}
                <div className="hotel-gallery">
                    {/* Main Image */}
                    <div className="hero-img-wrapper">
                        <img
                            src={hotel.images[activeImg]}
                            className="hero-img"
                            alt="Hotel"
                        />
                    </div>

                    {/* Thumbnail Row */}
                    <div className="thumb-row">
                        {hotel.images.map((img, i) => (
                            <div
                                key={i}
                                className={`thumb-wrapper ${activeImg === i ? "active" : ""}`}
                                onClick={() => setActiveImg(i)}
                            >
                                <img src={img} alt="thumb" className="thumb-img" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* HOTEL CONTENT */}
                <div className="row mt-4 g-4">

                    {/* LEFT CONTENT */}
                    <div className="col-lg-8">

                        {/* DESCRIPTION */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h4 className="fw-bold mb-3">About this stay</h4>
                                <p className="text-muted">{hotel.description}</p>
                            </div>
                        </div>

                        {/* AMENITIES */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h4 className="fw-bold mb-3">Amenities</h4>

                                <div className="amenities-grid">
                                    {hotel.amenities.map((a, i) => (
                                        <div key={i} className="amenity-item">
                                            <i className="bi bi-check-circle-fill text-primary me-2"></i>
                                            {a}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="col-lg-4">
                        <div className="booking-box card shadow-sm">
                            <div className="card-body">

                                <h3 className="fw-bold mb-1">
                                    ${hotel.pricePerNight}
                                    <span className="text-muted small"> / night</span>
                                </h3>

                                <p className="text-muted small mb-3">Taxes may apply</p>

                                <button className="btn btn-primary w-100 py-2 mb-3">
                                    Continue to Booking
                                </button>

                                <p className="small text-muted">
                                    You won't be charged yet — you’ll confirm details on the next page.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
