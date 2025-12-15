// src/owners/OwnerLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function OwnerLayout() {
    return (
        <div className="owner-layout-wrapper">
            <div className="container" style={{ maxWidth: "1200px" }}>

                {/* 🔥 HEADER */}
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

                {/* 🔥 NAV TABS */}
                <div className="owner-tabs-wrapper">
                    <NavLink to="/owner/dashboard" className="owner-tab" end>
                        <i className="bi bi-speedometer2 me-2"></i>
                        Overview
                    </NavLink>

                    <NavLink to="/owner/hotels" className="owner-tab">
                        <i className="bi bi-building me-2"></i>
                        My Hotels
                    </NavLink>

                    <NavLink to="/owner/add-hotel" className="owner-tab">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Hotel
                    </NavLink>

                    <NavLink to="/owner/bookings" className="owner-tab">
                        <i className="bi bi-calendar-check me-2"></i>
                        Bookings
                    </NavLink>

                    <NavLink to="/owner/earnings" className="owner-tab">
                        <i className="bi bi-cash-stack me-2"></i>
                        Earnings
                    </NavLink>
                </div>

                {/* 🔥 THIS IS THE FIX */}
                <div className="owner-content shadow-sm">
                    <Outlet />
                </div>
            </div>

            {/* CSS (unchanged) */}
            <style>{`
                .owner-layout-wrapper {
                    padding-top: 30px;
                    padding-bottom: 40px;
                    background: #f7f9fc;
                }
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
                .owner-tabs-wrapper {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 25px;
                }
                .owner-tab {
                    background: white;
                    padding: 10px 18px;
                    border-radius: 14px;
                    text-decoration: none;
                    color: #5a5a5a;
                    border: 1px solid #e6e6e6;
                }
                .owner-tab.active {
                    background: #2f6ffb;
                    color: white;
                }
                .owner-content {
                    background: white;
                    padding: 28px;
                    border-radius: 20px;
                    min-height: 400px;
                }
            `}</style>
        </div>
    );
}
