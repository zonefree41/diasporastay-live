import { Link } from "react-router-dom"

const hotels = [
    {
        id: 1,
        name: "Addis Skyline Hotel",
        city: "Addis Ababa, Ethiopia",
        price: 120,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    },
    {
        id: 2,
        name: "Accra Beach Resort",
        city: "Accra, Ghana",
        price: 150,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000",
    },
    {
        id: 3,
        name: "Nairobi Garden Suites",
        city: "Nairobi, Kenya",
        price: 95,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000",
    },
    {
        id: 4,
        name: "Cape Town Heritage Lodge",
        city: "Cape Town, South Africa",
        price: 180,
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1000",
    },
]

export default function Explore() {
    return (
        <div className="container py-5">
            <h2 className="fw-bold text-center mb-5">Explore Diaspora Stays</h2>
            <div className="row g-4">
                {hotels.map((hotel) => (
                    <div className="col-md-6 col-lg-3" key={hotel.id}>
                        <div className="card h-100 shadow-sm border-0">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{hotel.name}</h5>
                                <p className="text-muted mb-1">{hotel.city}</p>
                                <p className="fw-bold">${hotel.price} / night</p>
                                <Link to={`/checkout?hotel=${hotel.id}`} className="btn btn-primary w-100">
                                    Reserve
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
