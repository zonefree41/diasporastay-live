export default function Privacy() {
    return (
        <div className="container py-5" style={{ maxWidth: 900 }}>
            <h2 className="mb-4">Privacy Policy</h2>

            <p>
                DiasporaStay respects your privacy and is committed to protecting
                your personal data.
            </p>

            <h5>1. Information We Collect</h5>
            <p>
                We collect account details, booking information, and contact
                data required to operate the platform.
            </p>

            <h5>2. Payments</h5>
            <p>
                Payments are processed securely by Stripe. DiasporaStay does not
                store full payment card details.
            </p>

            <h5>3. Data Usage</h5>
            <p>
                Your data is used to provide services, process bookings, and
                communicate important updates.
            </p>

            <h5>4. Data Sharing</h5>
            <p>
                We do not sell personal data. Information is shared only when
                necessary to operate the platform.
            </p>

            <h5>5. Security</h5>
            <p>
                We take reasonable steps to protect user information.
            </p>

            <p className="mt-4 text-muted">
                Last updated: {new Date().toLocaleDateString()}
            </p>
        </div>
    );
}
