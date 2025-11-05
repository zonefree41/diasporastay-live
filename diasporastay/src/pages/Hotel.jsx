import { useParams, Link, useNavigate } from 'react-router-dom'
import { HOTELS } from '../data/hotels'


export default function Hotel() {
    const { id } = useParams()
    const navigate = useNavigate()
    const hotel = HOTELS.find(h => h.id === id)


    if (!hotel) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">Hotel not found.</div>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>Go back</button>
            </div>
        )
    }


    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-md-7">
                    <img className="w-100 rounded-3 shadow-sm" src={hotel.image} alt={hotel.name} />
                </div>
                <div className="col-md-5">
                    <h2 className="mb-1">{hotel.name}</h2>
                    <div className="text-muted mb-2">{hotel.city}, {hotel.country}</div>
                    <div className="mb-2">
                        {hotel.tags.map(t => <span key={t} className="badge rounded-pill text-bg-light border me-1">{t}</span>)}
                    </div>
                    <p className="mb-3">{hotel.description}</p>
                    <div className="d-flex align-items-center justify-content-between">
                        <div><span className="h4 mb-0">${hotel.price}</span> <span className="text-muted">/night</span></div>
                        <Link className="btn btn-primary" to={`/checkout?hotel=${hotel.id}`}>Reserve</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}