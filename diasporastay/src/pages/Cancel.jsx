export default function Cancel() {
    return (
        <div className="container py-5 text-center">
            <h1 className="text-danger">❌ Payment Cancelled</h1>
            <p>No worries — you can try again anytime.</p>
            <a href="/checkout" className="btn btn-outline-secondary mt-3">Back to Checkout</a>
        </div>
    )
}
