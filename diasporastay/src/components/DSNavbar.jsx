import { Link, NavLink } from 'react-router-dom'

<div>
    <li className="nav-item"><NavLink className="nav-link" to="/my-bookings">My Bookings</NavLink></li>
</div>
export default function DSNavbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
            <div className="container">
                <Link className="navbar-brand text-primary" to="/">DiasporaStay</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
                    aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/explore">Explore</NavLink></li>
                        <li className="nav-item"><a className="nav-link" href="#footer">Contact</a></li>
                    </ul>
                    <Link to="/checkout" className="btn btn-primary ms-lg-3">My Bookings</Link>
                </div>
            </div>
        </nav>
    )
}