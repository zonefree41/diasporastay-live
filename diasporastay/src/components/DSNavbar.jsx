// src/components/DSNavbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Utility: initials from email
function getInitials(emailOrName) {
    if (!emailOrName) return "?";
    const text = emailOrName.split("@")[0];
    return text.slice(0, 2).toUpperCase();
}

export default function DSNavbar() {
    const navigate = useNavigate();

    const [ownerEmail, setOwnerEmail] = useState(localStorage.getItem("ownerEmail"));
    const [guestEmail, setGuestEmail] = useState(localStorage.getItem("guestEmail"));
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // one dropdown (guest OR owner)

    const menuRef = useRef(null);


    // Sync navbar on login/logout
    useEffect(() => {
        const syncNavbar = () => {
            setOwnerEmail(localStorage.getItem("ownerEmail"));
            setGuestEmail(localStorage.getItem("guestEmail"));
        };

        // Initial load
        syncNavbar();

        // Events that update navbar
        window.addEventListener("navbarUpdate", syncNavbar);
        window.addEventListener("storage", syncNavbar);

        return () => {
            window.removeEventListener("navbarUpdate", syncNavbar);
            window.removeEventListener("storage", syncNavbar);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const updateNavbar = () => {
            setOwnerEmail(localStorage.getItem("ownerEmail"));
            setGuestEmail(localStorage.getItem("guestEmail"));
        };

        updateNavbar(); // initial load

        window.addEventListener("navbarUpdate", updateNavbar);

        return () => window.removeEventListener("navbarUpdate", updateNavbar);
    }, []);


    // UNIVERSAL LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("ownerEmail");
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("guestEmail");
        localStorage.removeItem("guestToken");

        window.dispatchEvent(new Event("navbarUpdate"));
        setMenuOpen(false);
        navigate("/guest/profile");
    };

    const navClass = scrolled
        ? "navbar premium-nav shadow-sm bg-white"
        : "navbar premium-nav";

    const isGuest = !!guestEmail && !ownerEmail;
    const isOwner = !!ownerEmail;

    return (
        <nav className={`${navClass} navbar-expand-lg`}>
            <div className="container">

                {/* LOGO */}
                <Link className="navbar-brand fw-bold premium-logo" to="/">
                    DiasporaStay
                </Link>

                <button
                    className="navbar-toggler custom-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ds-navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="ds-navbar">
                    <ul className="navbar-nav ms-auto gap-3 align-items-center">

                        {/* Explore link */}
                        <li className="nav-item">
                            <Link className="nav-link premium-link" to="/explore">
                                Explore
                            </Link>
                        </li>

                        {/* =========================
                            NOT LOGGED IN
                        ========================== */}
                        {!isGuest && !isOwner && (
                            <>
                                <li>
                                    <Link
                                        className="btn btn-outline-primary premium-btn"
                                        to="/guest/login"
                                    >
                                        Guest Login
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="btn btn-primary premium-btn-filled"
                                        to="/owner/login"
                                    >
                                        Owner Login
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* =========================
                            GUEST OR OWNER LOGGED IN
                           (avatar dropdown)
                        ========================== */}
                        {(isGuest || isOwner) && (
                            <li className="nav-item avatar-dropdown-wrapper" ref={menuRef}>
                                {/* AVATAR BUTTON */}
                                <button
                                    type="button"
                                    className="avatar-btn"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                >
                                    <div className={`avatar-circle ${isOwner ? "host-avatar" : ""}`}>
                                        {getInitials(isGuest ? guestEmail : ownerEmail)}
                                    </div>
                                </button>

                                {/* DROPDOWN MENU */}
                                {menuOpen && (
                                    <div className="avatar-menu">
                                        {isGuest && (
                                            <>
                                                <Link
                                                    to="/guest/profile"
                                                    className="avatar-menu-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    My Profile
                                                </Link>

                                                <Link
                                                    to="/guest/bookings"
                                                    className="avatar-menu-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    My Bookings
                                                </Link>

                                                <div className="avatar-menu-divider" />

                                                <button
                                                    className="avatar-menu-item text-danger"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        )}

                                        {isOwner && (
                                            <>
                                                <Link
                                                    to="/owner/dashboard"
                                                    className="avatar-menu-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    to="/owner/my-hotels"
                                                    className="avatar-menu-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    My Hotels
                                                </Link>

                                                <Link
                                                    to="/owner/bookings"
                                                    className="avatar-menu-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Bookings
                                                </Link>

                                                <Link
                                                    to="/owner/earnings"
                                                    className="avatar-menu-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Earnings
                                                </Link>

                                                <div className="avatar-menu-divider" />

                                                <button
                                                    className="avatar-menu-item text-danger"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
