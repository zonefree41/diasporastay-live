// src/components/DSFooter.jsx
import { Link } from "react-router-dom";

export default function DSFooter() {
    return (
        <footer className="premium-footer mt-5 pt-5 pb-4">
            <div className="container">

                <div className="row gy-4">

                    {/* BRAND */}
                    <div className="col-md-4">
                        <h3 className="footer-logo mb-2">DiasporaStay</h3>
                        <p className="footer-text">
                            Book unique stays across Ethiopia.
                            From premium hotels to modern apartments —
                            find your perfect home away from home.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div className="col-md-2">
                        <h6 className="footer-heading">Explore</h6>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/explore">Hotels</Link></li>
                            <li><Link to="/guest/login">Guest Login</Link></li>
                            <li><Link to="/owner/login">Owner Login</Link></li>
                        </ul>
                    </div>

                    {/* OWNER LINKS */}
                    <div className="col-md-3">
                        <h6 className="footer-heading">For Owners</h6>
                        <ul className="footer-links">
                            <li><Link to="/owner/register">Register Property</Link></li>
                            <li><Link to="/owner/login">Owner Login</Link></li>
                            <li><Link to="/owner/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* SOCIAL */}
                    <div className="col-md-3">
                        <h6 className="footer-heading">Connect with us</h6>

                        <div className="d-flex gap-3 mt-2">
                            <a href="#" className="social-circle">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="social-circle">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="social-circle">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="#" className="social-circle">
                                <i className="bi bi-youtube"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <hr className="footer-divider" />

                <div className="text-center pt-3 footer-copy">
                    © {new Date().getFullYear()} DiasporaStay — All Rights Reserved.
                </div>

            </div>
        </footer>
    );
}
