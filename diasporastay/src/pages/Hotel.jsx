// src/hotels/Hotel.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";

// Airbnb-style date range picker
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function Hotel() {
    const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";
    const { id } = useParams();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    // Date range state
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            key: "selection",
        },
    ]);

    const [nights, setNights] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    /* =======================================
       LOAD HOTEL + AVAILABILITY
    ======================================= */
    useEffect(() => {
        const loadHotel = async () => {
            try {
                const res = await api.get(`/api/hotels/${id}`);
                setHotel(res.data);

                // Initialize total price once hotel is known
                const diffMs =
                    dateRange[0].endDate.getTime() -
                    dateRange[0].startDate.getTime();
                const nightsCalc = Math.max(
                    1,
                    Math.round(diffMs / (1000 * 60 * 60 * 24))
                );
                setNights(nightsCalc);
                setTotalPrice(nightsCalc * res.data.pricePerNight);
            } catch (err) {
                console.error("Hotel fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    /* =======================================
       HANDLE DATE CHANGE
    ======================================= */
    const handleDateChange = (item) => {
        const sel = item.selection;
        setDateRange([sel]);

        if (!hotel) return;

        const diffMs =
            sel.endDate.getTime() - sel.startDate.getTime();
        const nightsCalc = Math.max(
            1,
            Math.round(diffMs / (1000 * 60 * 60 * 24))
        );

        setNights(nightsCalc);
        setTotalPrice(nightsCalc * hotel.pricePerNight);
    };

    /* =======================================
       DISABLED DATES (UNAVAILABLE)
    ======================================= */
    const disabledDates = (hotel?.unavailableDates || []).map(
        (d) => new Date(d)
    );

    /* =======================================
       BOOK BUTTON (NEXT STEP → Stripe)
    ======================================= */
    const handleBookNow = async () => {
        try {
            const guestId = localStorage.getItem("guestId");

            if (!guestId) {
                alert("Please log in to book.");
                return;
            }

            const res = await api.post("/api/bookings/create-checkout", {
                hotelId: hotel._id,
                guestId,
                checkIn: dateRange[0].startDate,
                checkOut: dateRange[0].endDate,
                nights,
                totalPrice
            });

            // Redirect user to Stripe Checkout
            window.location.href = res.data.url;

        } catch (err) {
            console.error("Booking error:", err.response?.data);
            alert("Unable to start booking.");
        }
    };


    if (loading) return <div className="page-loading">Loading hotel...</div>;
    if (!hotel) return <div className="page-loading">Hotel not found.</div>;

    return (
        <div className="page-section fade-in">
            <div className="container" style={{ maxWidth: "1200px" }}>
                {/* HOTEL NAME & LOCATION */}
                <div className="mb-4">
                    <h1 className="fw-bold">{hotel.name}</h1>
                    <p className="text-muted">
                        {hotel.city}, {hotel.country}
                    </p>
                </div>

                {/* IMAGE GALLERY */}
                <div className="hotel-gallery">
                    <div className="hero-img-wrapper">
                        <img
                            src={hotel.images[activeImg]}
                            className="hero-img"
                            alt="Hotel"
                        />
                    </div>

                    <div className="thumb-row">
                        {hotel.images.map((img, i) => (
                            <div
                                key={i}
                                className={`thumb-wrapper ${activeImg === i ? "active" : ""
                                    }`}
                                onClick={() => setActiveImg(i)}
                            >
                                <img src={img} alt="thumb" className="thumb-img" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* CONTENT */}
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

                    {/* RIGHT SIDEBAR — BOOKING BOX */}
                    <div className="col-lg-4">
                        <div className="booking-box card shadow-sm">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">Select your stay</h5>

                                {/* Date range picker */}
                                <DateRange
                                    ranges={dateRange}
                                    onChange={handleDateChange}
                                    moveRangeOnFirstSelection={false}
                                    minDate={new Date()}
                                    disabledDates={disabledDates}
                                    rangeColors={["#4A3AFF"]}
                                />

                                {/* Price summary */}
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">
                                            ${hotel.pricePerNight} x {nights} night
                                            {nights > 1 ? "s" : ""}
                                        </span>
                                        <span className="fw-semibold">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-2 mt-3"
                                    onClick={handleBookNow}
                                    disabled={nights <= 0}
                                >
                                    Continue to payment
                                </button>

                                <p className="small text-muted mt-2">
                                    You won’t be charged yet — you’ll confirm your
                                    booking on the payment step.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
