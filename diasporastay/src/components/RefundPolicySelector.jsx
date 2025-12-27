export default function RefundPolicySelector({ value, onChange }) {
    return (
        <div style={{ marginTop: 12 }}>
            <label style={{ fontWeight: 700, marginBottom: 8, display: "block" }}>
                Refund policy
            </label>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>

                <label style={{ display: "block", marginBottom: 6 }}>
                    <input
                        type="radio"
                        value="FLEXIBLE_24H"
                        checked={value === "FLEXIBLE_24H"}
                        onChange={(e) => onChange(e.target.value)}
                    />{" "}
                    <strong>Flexible</strong> — Free cancellation up to 24 hours before check-in
                </label>

                <label style={{ display: "block", marginBottom: 6 }}>
                    <input
                        type="radio"
                        value="MODERATE_48H"
                        checked={value === "MODERATE_48H"}
                        onChange={(e) => onChange(e.target.value)}
                    />{" "}
                    <strong>Moderate</strong> — Free cancellation up to 48 hours before check-in
                </label>

                <label style={{ display: "block" }}>
                    <input
                        type="radio"
                        value="NON_REFUNDABLE"
                        checked={value === "NON_REFUNDABLE"}
                        onChange={(e) => onChange(e.target.value)}
                    />{" "}
                    <strong>Non-refundable</strong> — No refunds after booking
                </label>

            </div>
        </div>
    );
}
