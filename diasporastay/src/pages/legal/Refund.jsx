export default function Refund() {
    return (
        <div className="container py-5" style={{ maxWidth: 900 }}>
            <h2 className="mb-4">Refund & Cancellation Policy</h2>

            <p>
                Refunds and cancellations depend on the policies set by each
                hotel owner.
            </p>

            <h5>1. Guest Cancellations</h5>
            <p>
                Guests should review the hotel’s cancellation policy before
                booking. Refund eligibility varies by property.
            </p>

            <h5>2. Owner Cancellations</h5>
            <p>
                Hotel owners are responsible for honoring confirmed bookings or
                issuing refunds when applicable.
            </p>

            <h5>3. Payment Processing</h5>
            <p>
                Approved refunds are processed via Stripe and may take several
                business days to appear.
            </p>

            <h5>4. Disputes</h5>
            <p>
                DiasporaStay may assist with disputes but does not guarantee
                refund outcomes.
            </p>

            <p className="mt-4 text-muted">
                Last updated: {new Date().toLocaleDateString()}
            </p>
        </div>
    );
}
