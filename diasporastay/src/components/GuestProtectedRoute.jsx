import { Navigate } from "react-router-dom";

export default function GuestProtectedRoute({ children }) {
    const token = localStorage.getItem("guestToken");

    if (!token) {
        return <Navigate to="/guest/login" replace />;
    }

    return children;
}

