import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h3>Diasporastay Admin</h3>

                <nav>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/hotels">Hotels</Link>
                    <Link to="/admin/owners">Owners</Link>

                    <a
                        href="#"
                        onClick={() => {
                            localStorage.removeItem("adminToken");
                            window.location.href = "/admin/login";
                        }}
                    >
                        Logout
                    </a>
                </nav>
            </aside>

            <main className="admin-content">{children}</main>
        </div>
    );
}
