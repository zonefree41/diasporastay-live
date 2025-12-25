// src/pages/Home.jsx
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import OwnerAddHotelCard from "../components/OwnerAddHotelCard";
import useOwnerRedirect from "../hooks/useOwnerRedirect";
import "./Home.css";


const cities = [
    "Addis Ababa",
    "Bahir Dar",
    "Hawassa",
    "Dire Dawa",
    "Mekelle",
];

export default function Home() {
    const { goToHotelOrRegister } = useOwnerRedirect();
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState("");

    const ownerToken = localStorage.getItem("ownerToken");

    const handleHotelClick = (hotelId) => {
        if (!ownerToken) {
            window.location.href = "/owner/register";
        } else {
            window.location.href = `/hotels/${hotelId}`;
        }
    };

    useEffect(() => {
        const city = searchParams.get("city");
        if (city) setQuery(city);
    }, [searchParams]);

    return (
        <div className="home-page">

            {/* ================= HERO ================= */}
            <div className="home-hero text-center">
                <h1>Find your perfect stay anywhere in Ethiopia</h1>
                <p className="stripe-badge">
                    🇪🇹 Ethiopia — Stripe-supported payouts for verified hosts
                </p>
            </div>

            {/* ================= SEARCH ================= */}
            <div className="container home-search">
                <div className="row g-3 align-items-center">
                    <div className="col-md-10">
                        <input
                            className="form-control form-control-lg"
                            placeholder="Search city, hotel name, or location..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2 d-grid">
                        <Link
                            to={`/explore?search=${encodeURIComponent(query)}`}
                            className="btn btn-primary btn-lg"
                        >
                            Search
                        </Link>
                    </div>
                </div>
            </div>

            {/* ================= CITY CHIPS ================= */}
            <div className="container mt-3">
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {cities.map((city) => (
                        <Link
                            key={city}
                            to={`/?city=${encodeURIComponent(city)}`}
                            className="city-chip"
                        >
                            {city}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ================= FEATURED CAROUSEL ================= */}
            <div className="container mt-5">
                <h3 className="fw-bold mb-3">Featured Stays</h3>

                <div
                    id="featuredHotelsCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    data-bs-touch="true"
                    data-bs-interval="5000"
                >

                    <div className="carousel-inner">

                        {/* SLIDE 1 */}
                        <div className="carousel-item active">
                            <div className="row g-4 justify-content-center">
                                {[1, 2, 3].map((n) => (
                                    <div className="col-12 col-md-4" key={n}>
                                        <div className="card featured-card shadow-sm">
                                            <img
                                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                                                className="card-img-top"
                                                alt="Hotel"
                                            />
                                            <div className="card-body">
                                                <h5
                                                    className="fw-bold text-primary"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => goToHotelOrRegister("123")}
                                                >
                                                    Premium Addis Hotel
                                                </h5>
                                                <p className="text-muted mb-1">
                                                    Addis Ababa, Ethiopia
                                                </p>
                                                <p className="fw-bold text-primary">
                                                    $89 / night
                                                </p>
                                                <h5
                                                    className="fw-bold text-primary"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => goToHotelSmart("123")}
                                                >
                                                    Premium Addis Hotel
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SLIDE 2 */}
                        <div className="carousel-item">
                            <div className="row g-4 justify-content-center">
                                {[1, 2, 3].map((n) => (
                                    <div className="col-12 col-md-4" key={n}>
                                        <div className="card featured-card shadow-sm">
                                            <img
                                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                                className="card-img-top"
                                                alt="Hotel"
                                            />
                                            <div className="card-body">
                                                <h5 className="fw-bold">Lakeside Resort</h5>
                                                <p className="text-muted mb-1">
                                                    Bahir Dar, Ethiopia
                                                </p>
                                                <p className="fw-bold text-primary">
                                                    $75 / night
                                                </p>
                                                <h5
                                                    className="fw-bold text-primary"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => goToHotelSmart("123")}
                                                >
                                                    Premium Addis Hotel
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* OWNER CTA SLIDE */}
                        <div className="carousel-item">
                            <div className="owner-carousel-slide">
                                <h2 className="fw-bold mb-3">
                                    Become a DiasporaStay Host
                                </h2>
                                <p className="mb-4">
                                    List your property and earn from global travelers.
                                    Secure payouts powered by Stripe.
                                </p>
                                <Link
                                    to="/owner/login"
                                    className="btn btn-light btn-lg px-4"
                                >
                                    ➕ List Your Property
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* CONTROLS */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#featuredHotelsCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" />
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#featuredHotelsCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" />
                    </button>
                </div>
            </div>

            {/* ================= OWNER CTA (ALWAYS VISIBLE) ================= */}
            <div className="container mt-5">
                <div className="owner-banner">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="fw-bold mb-2">
                                Become a DiasporaStay Host
                            </h2>
                            <p className="text-muted mb-0">
                                List your hotel and earn from global travelers.
                                Secure payouts powered by Stripe.
                            </p>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            <Link
                                to="/owner/login"
                                className="btn btn-primary btn-lg"
                            >
                                ➕ List Your Property
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
