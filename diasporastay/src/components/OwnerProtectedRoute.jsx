import { Navigate } from "react-router-dom";

export default function OwnerProtectedRoute({ children }) {
    const ownerToken = localStorage.getItem("ownerToken");

    if (!ownerToken) {
        return <Navigate to="/owner/login" replace />;
    }

    return children;
}
