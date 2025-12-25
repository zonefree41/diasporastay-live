// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [ownerEmail, setOwnerEmail] = useState(null);
    const [guestEmail, setGuestEmail] = useState(null);

    useEffect(() => {
        setOwnerEmail(localStorage.getItem("ownerEmail"));
        setGuestEmail(localStorage.getItem("guestEmail"));
    }, []);

    const loginOwner = (email) => {
        localStorage.setItem("ownerEmail", email);
        setOwnerEmail(email);
    };

    const logoutOwner = () => {
        localStorage.removeItem("ownerEmail");
        setOwnerEmail(null);
    };

    const loginGuest = (email) => {
        localStorage.setItem("guestEmail", email);
        setGuestEmail(email);
    };

    const logoutGuest = () => {
        localStorage.removeItem("guestEmail");
        setGuestEmail(null);
    };

    return (
        <AuthContext.Provider
            value={{
                ownerEmail,
                guestEmail,
                loginOwner,
                loginGuest,
                logoutOwner,
                logoutGuest,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
};
