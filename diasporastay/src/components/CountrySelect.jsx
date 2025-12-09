// src/components/CountrySelect.jsx
import { useState } from "react";
import { countries } from "../data/countries";
import { FaSearch } from "react-icons/fa";
import "./CountrySelect.css";

export default function CountrySelect({ value, onChange }) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    // Filter countries by search
    const filtered = countries.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="country-select-container">
            <div
                className="country-select-box"
                onClick={() => setOpen(!open)}
            >
                <span>{value || "Select Country"}</span>
            </div>

            {open && (
                <div className="country-dropdown shadow-sm">
                    {/* Search bar */}
                    <div className="country-search">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search countries..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Country list */}
                    <div className="country-options">
                        {filtered.length === 0 && (
                            <div className="no-results">No matches found</div>
                        )}

                        {filtered.map((country) => (
                            <div
                                key={country}
                                className="country-option"
                                onClick={() => {
                                    onChange(country);
                                    setOpen(false);
                                }}
                            >
                                {country}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
