import { useEffect, useState } from "react";
import api from "../axios";
import AdminLayout from "./AdminLayout";

export default function Owners() {
    const [owners, setOwners] = useState([]);
    const API = import.meta.env.VITE_API_BASE;
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        axios
            .get(`${API}/admin/owners`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setOwners(res.data));
    }, []);

    return (
        <AdminLayout>
            <h2>All Hotel Owners</h2>

            <ul>
                {owners.map((o) => (
                    <li key={o._id}>
                        {o.name} — {o.email} — Hotels: {o.hotelsCount}
                    </li>
                ))}
            </ul>
        </AdminLayout>
    );
}
