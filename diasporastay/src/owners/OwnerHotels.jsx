import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function OwnerHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("ownerToken");

    useEffect(() => {
        loadHotels();
    }, []);

    const loadHotels = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/owner/hotels`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setHotels(res.data || []);
        } catch (err) {
            console.error("Failed to load hotels", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading hotels...</p>;

    // ✅ EMPTY STATE
    if (hotels.length === 0) {
        return (
            <div className="text-center py-5">
                <h4 className="mb-3">🏨 No hotels yet</h4>
                <p className="text-muted mb-4">
                    Add your first property to start receiving bookings.
                </p>
                <Link to="/owner/add-hotel" className="btn btn-primary">
                    + Add Hotel
                </Link>
            </div>
        );
    }

    // ✅ NORMAL LIST
    return (
        <div>
            <h4 className="mb-4">My Hotels</h4>
            {hotels.map((hotel) => (
                <div key={hotel._id} className="card mb-3 p-3">
                    <h5>{hotel.name}</h5>
                    <p className="text-muted mb-0">
                        {hotel.city}, {hotel.country}
                    </p>
                </div>
            ))}
        </div>
    );
}
