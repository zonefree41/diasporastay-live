// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-page">

            {/* HERO SECTION */}
            <div className="home-hero text-center">
                <h1>Find your perfect stay anywhere in Ethiopia</h1>
            </div>

            {/* SEARCH BAR */}
            <div className="container home-search">
                <div className="row g-3 align-items-center">
                    <div className="col-md-10">
                        <input
                            className="form-control form-control-lg"
                            placeholder="Search city, hotel name, or location..."
                        />
                    </div>
                    <div className="col-md-2 d-grid">
                        <Link to="/explore" className="btn btn-primary btn-lg">
                            Search
                        </Link>
                    </div>
                </div>
            </div>

            {/* FEATURED HOTELS */}
            <div className="container mt-5">
                <h3 className="fw-bold mb-3">Featured Hotels</h3>

                <div className="featured-grid">
                    {/* SAMPLE CARDS */}
                    {[1, 2, 3].map((n) => (
                        <div className="card featured-card" key={n}>
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                                alt=""
                            />

                            <div className="card-body">
                                <h5 className="fw-bold">Premium Addis Hotel</h5>
                                <p className="text-muted mb-1">Addis Ababa, Ethiopia</p>
                                <p className="fw-bold text-primary">$89 / night</p>
                                <Link to="/hotels/123" className="btn btn-outline-primary w-100">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
