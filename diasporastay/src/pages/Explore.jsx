import { useState } from "react";
import { HOTELS } from "../data/hotels";

export default function Explore() {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Unique country list for dropdown
    const countries = [...new Set(HOTELS.map(h => h.country))];

    // Filter hotels by country + search term
    const filteredHotels = HOTELS.filter((h) => {
        const matchesCountry = selectedCountry ? h.country === selectedCountry : true;
        const matchesSearch =
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.country.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCountry && matchesSearch;
    });

    return (
        <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">Explore Stays</h2>

            {/* Filter and Search Controls */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                <select
                    className="form-select w-auto"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                >
                    <option value="">🌍 All Countries</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    className="form-control w-auto"
                    style={{ minWidth: "250px" }}
                    placeholder="🔍 Search by city or hotel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Hotel Cards */}
            <div className="row">
                {filteredHotels.map((hotel) => (
                    <div className="col-md-4 mb-4" key={hotel.id}>
                        <div className="card shadow-sm h-100 border-0">
                            <img
                                src={hotel.image}
                                className="card-img-top"
                                alt={hotel.name}
                                style={{ height: "220px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{hotel.name}</h5>
                                <p className="text-muted mb-1">
                                    {hotel.city}, {hotel.country} {hotel.flag}
                                </p>
                                <p className="fw-semibold text-primary">${hotel.price} / night</p>
                                <a
                                    href={`/hotel/${hotel.id}`}
                                    className="btn btn-outline-primary w-100"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message */}
            {filteredHotels.length === 0 && (
                <p className="text-center text-muted mt-4">
                    No hotels found. Try another search.
                </p>
            )}
        </div>
    );
}
