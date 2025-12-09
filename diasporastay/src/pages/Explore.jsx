import { useEffect, useState } from "react";
import api from "../axios";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Explore() {
  const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/hotels`);
        setHotels(res.data);
      } catch (err) {
        console.error("Explore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page-loading">Loading hotels...</div>;

  return (
    <div className="page-section fade-in">
      <div className="container" style={{ maxWidth: "1300px" }}>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Explore Stays</h2>
          <p className="text-muted mb-0">{hotels.length} results</p>
        </div>

        {/* HOTEL GRID */}
        <div className="explore-grid">
          {hotels.map((hotel) => (
            <Link
              key={hotel._id}
              to={`/hotels/${hotel._id}`}
              className="explore-card"
            >
              <div className="explore-card-img-wrapper">
                <img
                  src={hotel.images?.[0]}
                  alt={hotel.name}
                  className="explore-card-img"
                />
              </div>

              <div className="explore-card-body">
                <h5 className="hotel-name">{hotel.name}</h5>

                <p className="text-muted small">
                  {hotel.city}, {hotel.country}
                </p>

                <p className="price fw-semibold">
                  ${hotel.pricePerNight}
                  <span className="text-muted small"> / night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
