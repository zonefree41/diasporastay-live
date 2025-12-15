export default function Terms() {
    return (
        <div className="container py-5" style={{ maxWidth: 900 }}>
            <h2 className="mb-4">Terms of Service</h2>

            <p>
                Welcome to DiasporaStay. By using our platform, you agree to the
                following terms.
            </p>

            <h5>1. Platform Role</h5>
            <p>
                DiasporaStay is a marketplace that connects guests with hotel
                owners. We do not own or operate listed properties.
            </p>

            <h5>2. Bookings & Payments</h5>
            <p>
                Guests pay through Stripe. DiasporaStay collects a 12% platform
                fee. The remaining amount is payable to the hotel owner.
            </p>

            <h5>3. Cancellations & Refunds</h5>
            <p>
                Cancellation policies are set by hotel owners. DiasporaStay may
                assist with disputes but is not responsible for owner decisions.
            </p>

            <h5>4. Liability</h5>
            <p>
                DiasporaStay is not liable for property conditions, guest
                experiences, or owner actions.
            </p>

            <h5>5. Account Responsibility</h5>
            <p>
                Users are responsible for maintaining the security of their
                accounts.
            </p>

            <p className="mt-4 text-muted">
                Last updated: {new Date().toLocaleDateString()}
            </p>
        </div>
    );
}
