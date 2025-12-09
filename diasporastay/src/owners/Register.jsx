import { useState } from "react";
import api from "../axios";

export default function OwnerRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API = import.meta.env.VITE_API_BASE;

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/owner/auth/register`, {
                name,
                email,
                password,
            });

            alert("Account created! Please log in.");
            window.location.href = "/owner/login";
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Hotel Owner Register</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}
