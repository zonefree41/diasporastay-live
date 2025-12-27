export default function CancelBookingModal({
    booking,
    onClose,
    onConfirm,
    loading,
}) {
    const policyText = {
        FLEXIBLE_24H: "Full refund if cancelled 24h before check-in.",
        MODERATE_48H: "Full refund if cancelled 48h before check-in.",
        NON_REFUNDABLE: "This booking is non-refundable.",
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <h3 style={{ marginTop: 0 }}>Cancel booking?</h3>

                <p style={{ color: "#374151", marginBottom: 12 }}>
                    {policyText[booking.refundPolicy]}
                </p>

                <p style={{ fontSize: 13, color: "#6b7280" }}>
                    If eligible, your refund will be processed automatically to your
                    original payment method.
                </p>

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button style={cancelBtn} onClick={onClose}>
                        Keep booking
                    </button>

                    <button
                        style={dangerBtn}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Cancelling…" : "Confirm cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* styles */
const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
};

const modal = {
    background: "#fff",
    padding: 24,
    borderRadius: 18,
    maxWidth: 420,
    width: "100%",
    boxShadow: "0 20px 40px rgba(0,0,0,.2)",
};

const cancelBtn = {
    flex: 1,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    padding: 12,
    borderRadius: 12,
    fontWeight: 700,
};

const dangerBtn = {
    flex: 1,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 12,
    fontWeight: 800,
};
