import { Link } from "react-router-dom"

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section
                className="d-flex align-items-center text-center text-white"
                style={{
                    background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1590490359683-7b1e35c3b1c4?q=80&w=1600') center/cover no-repeat",
                    minHeight: "90vh"
                }}
            >
                <div className="container">
                    <h1 className="display-3 fw-bold mb-3">Find Your Stay Across the Diaspora</h1>
                    <p className="lead mb-4">Connecting travelers to heritage — one destination at a time.</p>
                    <Link to="/explore" className="btn btn-primary btn-lg px-4 py-2 shadow">
                        Explore Hotels
                    </Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold mb-5">How It Works</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <i className="bi bi-search display-5 text-primary"></i>
                            <h5 className="mt-3">1. Browse</h5>
                            <p className="text-muted">Search curated hotels and stays across Africa & the diaspora.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="bi bi-credit-card display-5 text-primary"></i>
                            <h5 className="mt-3">2. Book Securely</h5>
                            <p className="text-muted">Pay confidently using Stripe Checkout — no hidden fees.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="bi bi-suitcase2 display-5 text-primary"></i>
                            <h5 className="mt-3">3. Enjoy Your Stay</h5>
                            <p className="text-muted">Experience authentic hospitality and reconnect with your roots.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
