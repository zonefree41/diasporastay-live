import OwnerLayout from "./OwnerLayout";
import OwnerNextPayoutBanner from "../components/OwnerNextPayoutBanner";

export default function Dashboard() {
    return (
        <OwnerLayout>
            {/* ✅ Next payout banner */}
            <OwnerNextPayoutBanner />

            <h2 className="mt-3">Welcome, Hotel Owner</h2>
            <p>Use the sidebar to manage your hotels.</p>
        </OwnerLayout>
    );
}

