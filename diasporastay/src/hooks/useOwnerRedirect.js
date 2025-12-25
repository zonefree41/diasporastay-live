import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useOwnerRedirect() {
    const navigate = useNavigate();

    const goToHotelSmart = (hotelId) => {
        const ownerToken = localStorage.getItem("ownerToken");
        const guestToken = localStorage.getItem("guestToken");

        // 🚫 Nobody logged in → encourage owner signup
        if (!ownerToken && !guestToken) {
            toast.info("Create an owner account to continue", {
                icon: "🏨",
            });

            setTimeout(() => {
                navigate("/owner/register", {
                    state: { intent: "list-property" },
                });
            }, 1200);

            return;
        }

        // 🏨 Owner logged in
        if (ownerToken) {
            navigate("/owner/add-hotel");
            return;
        }

        // 👤 Guest logged in
        if (guestToken) {
            navigate(`/hotels/${hotelId}`);
            return;
        }
    };

    return { goToHotelSmart };
}
