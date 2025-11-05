import { Link } from 'react-router-dom'


export default function HotelCard({ hotel }) {
    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <img src={hotel.image} className="card-img-top" alt={hotel.name} />
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">{hotel.name}</h5>
                        <span className="badge text-bg-success">{hotel.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-muted mb-2">{hotel.city}, {hotel.country}</p>
                    <div className="mb-2 d-flex gap-1 flex-wrap">
                        {hotel.tags?.slice(0, 3).map(t => (
                            <span key={t} className="badge rounded-pill text-bg-light border">{t}</span>
                        ))}
                    </div>
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                        <div><strong>${hotel.price}</strong><span className="text-muted"> /night</span></div>
                        <Link to={`/hotel/${hotel.id}`} className="btn btn-outline-primary">View</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}