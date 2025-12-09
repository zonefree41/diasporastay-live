export default function ResetSuccess() {
    return (
        <div className="auth-wrapper d-flex justify-content-center align-items-center py-5">
            <div className="auth-card shadow-lg p-5 rounded-4 text-center" style={{ maxWidth: 500 }}>

                <div className="mb-4">
                    <i className="fa-solid fa-circle-check"
                        style={{ fontSize: 70, color: "#f4c542" }}></i>
                </div>

                <h2 className="fw-bold">Password Updated</h2>
                <p className="text-muted mt-2">
                    Your new password has been saved successfully.
                    You can now log in to your Owner Dashboard.
                </p>

                <a href="/owner/login"
                    className="btn btn-primary premium-btn-filled w-100 mt-4">
                    Go to Login
                </a>
            </div>
        </div>
    );
}
