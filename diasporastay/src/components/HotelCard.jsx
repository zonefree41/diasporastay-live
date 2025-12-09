import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
    if (!hotel) return null;

    let image = hotel.images?.[0] || hotel.image;

    // FIX: If still missing, use fallback
    if (!image) {
        image = "https://via.placeholder.com/600x400?text=No+Image+Available";
    }

    // FIX UNSPLASH URL MISSING PARAMETERS
    if (image.startsWith("https://images.unsplash.com")) {
        image += "&auto=format&w=1200&q=80";
    }

    const price =
        hotel.price ||
        hotel.pricePerNight ||
        0;

    return (
        <div className="col-md-4 col-sm-6">
            <div className="card shadow-sm h-100" style={{ borderRadius: "10px" }}>
                <Link to={`/hotels/${hotel._id}`}>
                    <img
                        src={image}
                        className="card-img-top"
                        alt={hotel.name}
                        style={{
                            height: "220px",
                            width: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px"
                        }}
                    />
                </Link>

                <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold">{hotel.name}</h5>

                    {hotel.location && (
                        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                            {hotel.location}
                        </p>
                    )}

                    <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                        {hotel.description?.substring(0, 80)}...
                    </p>

                    <div className="mt-auto">
                        <p className="fw-bold mb-2">
                            ${price} <span className="text-muted">/ night</span>
                        </p>

                        <Link
                            className="btn btn-primary w-100"
                            to={`/hotels/${hotel._id}`}
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
