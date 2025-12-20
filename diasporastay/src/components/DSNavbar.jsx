// src/components/DSNavbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/* =========================
   UTIL
========================= */
function getInitials(email) {
    if (!email) return "?";
    return email.split("@")[0].slice(0, 2).toUpperCase();
}

export default function DSNavbar() {
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const [ownerEmail, setOwnerEmail] = useState(null);
    const [guestEmail, setGuestEmail] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const isGuest = !!guestEmail && !ownerEmail;
    const isOwner = !!ownerEmail;

    /* =========================
       SYNC AUTH STATE
    ========================= */
    useEffect(() => {
        const sync = () => {
            setOwnerEmail(localStorage.getItem("ownerEmail"));
            setGuestEmail(localStorage.getItem("guestEmail"));
        };

        sync();
        window.addEventListener("storage", sync);
        window.addEventListener("navbarUpdate", sync);

        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("navbarUpdate", sync);
        };
    }, []);

    /* =========================
       CLOSE MENU ON OUTSIDE CLICK
    ========================= */
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    /* =========================
       LOGOUT
    ========================= */
    const handleLogout = () => {
        localStorage.removeItem("ownerEmail");
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("guestEmail");
        localStorage.removeItem("guestToken");

        window.dispatchEvent(new Event("navbarUpdate"));
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm">
            <div className="container">
                {/* LOGO */}
                <Link className="navbar-brand fw-bold" to="/">
                    DiasporaStay
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ds-navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="ds-navbar">
                    <ul className="navbar-nav ms-auto align-items-center gap-3">

                        {/* Explore */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/explore">
                                Explore
                            </Link>
                        </li>

                        {/* NOT LOGGED IN */}
                        {!isGuest && !isOwner && (
                            <>
                                <li>
                                    <Link className="btn btn-outline-primary" to="/guest/login">
                                        Guest Login
                                    </Link>
                                </li>
                                <li>
                                    <Link className="btn btn-primary" to="/owner/login">
                                        Owner Login
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* LOGGED IN (AVATAR) */}
                        {(isGuest || isOwner) && (
                            <li ref={menuRef} className="nav-item position-relative">
                                <button
                                    className="btn rounded-circle bg-primary text-white fw-bold"
                                    style={{ width: 40, height: 40 }}
                                    onClick={() => setMenuOpen(!menuOpen)}
                                >
                                    {getInitials(isGuest ? guestEmail : ownerEmail)}
                                </button>

                                {menuOpen && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{ right: 0, left: "auto" }}
                                    >
                                        {/* GUEST MENU */}
                                        {isGuest && (
                                            <>
                                                <Link
                                                    to="/guest/profile"
                                                    className="dropdown-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    My Profile
                                                </Link>

                                                <Link
                                                    to="/my-bookings"   // ✅ FIXED
                                                    className="dropdown-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    My Bookings
                                                </Link>

                                                <div className="dropdown-divider" />
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        )}

                                        {/* OWNER MENU */}
                                        {isOwner && (
                                            <>
                                                <Link
                                                    to="/owner/dashboard"
                                                    className="dropdown-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    to="/owner/my-hotels"
                                                    className="dropdown-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    My Hotels
                                                </Link>

                                                <Link
                                                    to="/owner/bookings"
                                                    className="dropdown-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Bookings
                                                </Link>

                                                <Link
                                                    to="/owner/earnings"
                                                    className="dropdown-item"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Earnings
                                                </Link>

                                                <div className="dropdown-divider" />
                                                <button
                                                    className="dropdown-item text-danger"
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
