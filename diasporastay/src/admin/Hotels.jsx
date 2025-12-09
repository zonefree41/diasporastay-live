import { useEffect, useState } from "react";
import api from "../axios";
import AdminLayout from "./AdminLayout";

export default function Hotels() {
    const [hotels, setHotels] = useState([]);
    const API = import.meta.env.VITE_API_BASE;
    const token = localStorage.getItem("adminToken");

    const loadHotels = async () => {
        const res = await axios.get(`${API}/admin/hotels`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setHotels(res.data);
    };

    const approveHotel = async (id) => {
        await axios.put(`${API}/admin/hotels/approve/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        loadHotels();
    };

    const deleteHotel = async (id) => {
        await axios.delete(`${API}/admin/hotels/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        loadHotels();
    };

    useEffect(() => {
        loadHotels();
    }, []);

    return (
        <AdminLayout>
            <h2>All Hotels</h2>

            <ul>
                {hotels.map((h) => (
                    <li key={h._id}>
                        {h.name} — {h.city} ({h.owner?.name})
                        <strong> [{h.status}]</strong>

                        {h.status !== "approved" && (
                            <button onClick={() => approveHotel(h._id)}>Approve</button>
                        )}

                        <button onClick={() => deleteHotel(h._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </AdminLayout>
    );
}
