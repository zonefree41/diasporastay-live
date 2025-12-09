// src/components/OwnerProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function OwnerProtectedRoute({ children }) {
    const ownerEmail = localStorage.getItem("ownerEmail");
    const ownerToken = localStorage.getItem("ownerToken");

    if (!ownerEmail || !ownerToken) {
        return <Navigate to="/owner/login" replace />;
    }

    return children;
}
