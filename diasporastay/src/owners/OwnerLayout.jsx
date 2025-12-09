// src/owners/OwnerLayout.jsx
import { NavLink, Link } from "react-router-dom";

export default function OwnerLayout({ children, active = "dashboard" }) {
    return (
        <div className="owner-layout-wrapper">
            <div className="container" style={{ maxWidth: "1200px" }}>

                {/* 🔥 PREMIUM HEADER */}
                <div className="owner-header shadow-sm">
                    <div>
                        <h2 className="fw-bold mb-1">Owner Dashboard</h2>
                        <p className="text-muted mb-0">
                            Manage hotels, bookings & earnings from one place.
                        </p>
                    </div>

                    <div>
                        <span className="owner-pill">Owner Portal</span>
                    </div>
                </div>

                {/* 🔥 PREMIUM NAV TABS */}
                <div className="owner-tabs-wrapper">
                    <NavLink
                        to="/owner/dashboard"
                        className="owner-tab"
                        end
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Overview
                    </NavLink>

                    <NavLink
                        to="/owner/my-hotels"
                        className="owner-tab"
                    >
                        <i className="bi bi-building me-2"></i>
                        My Hotels
                    </NavLink>

                    <NavLink
                        to="/owner/add-hotel"
                        className="owner-tab"
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Hotel
                    </NavLink>

                    <NavLink
                        to="/owner/bookings"
                        className="owner-tab"
                    >
                        <i className="bi bi-calendar-check me-2"></i>
                        Bookings
                    </NavLink>

                    <NavLink
                        to="/owner/earnings"
                        className="owner-tab"
                    >
                        <i className="bi bi-cash-stack me-2"></i>
                        Earnings
                    </NavLink>
                </div>

                {/* 🔥 MAIN CONTENT CARD */}
                <div className="owner-content shadow-sm">
                    {children}
                </div>
            </div>

            {/* PREMIUM CSS */}
            <style>{`
                .owner-layout-wrapper {
                    padding-top: 30px;
                    padding-bottom: 40px;
                    background: #f7f9fc;
                }

                /* Header */
                .owner-header {
                    background: white;
                    padding: 22px 28px;
                    border-radius: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                .owner-pill {
                    background: linear-gradient(90deg, #4e8cff, #6ea8ff);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 14px;
                }

                /* Tabs */
                .owner-tabs-wrapper {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 6px;
                    margin-bottom: 25px;
                }

                .owner-tab {
                    background: white;
                    padding: 10px 18px;
                    border-radius: 14px;
                    font-weight: 500;
                    color: #5a5a5a;
                    text-decoration: none;
                    border: 1px solid #e6e6e6;
                    transition: all .25s ease;
                    white-space: nowrap;
                }

                .owner-tab:hover {
                    background: #eef5ff;
                    color: #2f6ffb;
                    border-color: #d6e4ff;
                }

                .owner-tab.active {
                    background: #2f6ffb;
                    color: white !important;
                    border-color: #2f6ffb;
                    font-weight: 600;
                }

                /* Main Content Card */
                .owner-content {
                    background: white;
                    padding: 28px;
                    border-radius: 20px;
                    min-height: 400px;
                }

                /* Scrollbar for mobile tabs */
                .owner-tabs-wrapper::-webkit-scrollbar {
                    height: 6px;
                }

                .owner-tabs-wrapper::-webkit-scrollbar-thumb {
                    background: #d0d7e2;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
