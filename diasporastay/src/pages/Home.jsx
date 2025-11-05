import { Link } from 'react-router-dom'


export default function Home() {
    return (
        <>
            <section className="hero">
                <div className="container text-center py-5">
                    <h1 className="display-4 mb-3">Stay close to your roots.</h1>
                    <p className="lead mb-4">Handpicked stays across Africa & the diaspora—book with confidence.</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <Link to="/explore" className="btn btn-primary btn-lg">Explore Stays</Link>
                        <a href="#how" className="btn btn-outline-light btn-lg">How it works</a>
                    </div>
                </div>
            </section>


            <section id="how" className="py-5 bg-white">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4"><h4>1. Browse</h4><p>Discover curated hotels with verified amenities.</p></div>
                        <div className="col-md-4"><h4>2. Reserve</h4><p>Transparent pricing and secure checkout.</p></div>
                        <div className="col-md-4"><h4>3. Enjoy</h4><p>24/7 support for a stress‑free trip.</p></div>
                    </div>
                </div>
            </section>
        </>
    )
}