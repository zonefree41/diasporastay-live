import { useMemo, useState } from 'react'
import { HOTELS } from '../data/hotels'
import HotelCard from '../components/HotelCard'


export default function Explore() {
    const [q, setQ] = useState('')
    const [min, setMin] = useState('')
    const [max, setMax] = useState('')


    const results = useMemo(() => {
        return HOTELS.filter(h => {
            const matchQ = q ? (h.name + h.city + h.country + h.tags.join(' ')).toLowerCase().includes(q.toLowerCase()) : true
            const matchMin = min ? h.price >= Number(min) : true
            const matchMax = max ? h.price <= Number(max) : true
            return matchQ && matchMin && matchMax
        })
    }, [q, min, max])


    return (
        <div className="container py-4">
            <div className="bg-white border rounded-3 p-3 mb-4">
                <div className="row g-2 align-items-end">
                    <div className="col-md-6">
                        <label className="form-label">Search</label>
                        <input className="form-control" placeholder="City, hotel, feature..." value={q} onChange={e => setQ(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Min $</label>
                        <input type="number" className="form-control" value={min} onChange={e => setMin(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Max $</label>
                        <input type="number" className="form-control" value={max} onChange={e => setMax(e.target.value)} />
                    </div>
                    <div className="col-md-2 text-md-end">
                        <button className="btn btn-outline-secondary w-100" onClick={() => { setQ(''); setMin(''); setMax('') }}>Reset</button>
                    </div>
                </div>
            </div>


            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {results.map(h => <HotelCard key={h.id} hotel={h} />)}
                {results.length === 0 && (
                    <div className="col"><div className="alert alert-secondary">No results. Try broadening your search.</div></div>
                )}
            </div>
        </div>
    )
}