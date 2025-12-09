import { useState } from "react";
import api from "../axios";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API = import.meta.env.VITE_API_BASE;

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/admin/login`, { email, password });
            localStorage.setItem("adminToken", res.data.token);
            window.location.href = "/admin";
        } catch (err) {
            alert("Invalid admin credentials");
        }
    };

    return (
        <div className="auth-container">
            <h2>Admin Login</h2>

            <form onSubmit={submit}>
                <input
                    type="email"
                    placeholder="Admin Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}
