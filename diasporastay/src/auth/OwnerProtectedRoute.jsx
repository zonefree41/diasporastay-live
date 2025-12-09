import { Navigate } from "react-router-dom";

export default function OwnerProtectedRoute({ children }) {
    const token = localStorage.getItem("ownerToken");

    if (!token) return <Navigate to="/owner/login" />;

    return children;
}
