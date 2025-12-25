// src/hooks/useOwnerRedirect.js
import { useNavigate } from "react-router-dom";

export default function useOwnerRedirect() {
    const navigate = useNavigate();

    const goToHotelOrRegister = (hotelId) => {
        const ownerToken = localStorage.getItem("ownerToken");

        if (!ownerToken) {
            // New owner → onboarding
            navigate("/owner/register", {
                state: { intent: "list-property" },
            });
        } else {
            // Owner logged in → view hotel
            navigate(`/hotels/${hotelId}`);
        }
    };

    return { goToHotelOrRegister };
}
