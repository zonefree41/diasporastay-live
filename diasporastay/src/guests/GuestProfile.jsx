import { useEffect, useRef, useState } from "react";
import {
    FaUserCircle,
    FaEnvelope,
    FaCalendarAlt,
    FaPhone,
    FaCamera,
} from "react-icons/fa";
import "../styles/theme.css";

export default function GuestProfile() {
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [guestEmail, setGuestEmail] = useState("");
    const [guestName, setGuestName] = useState("");
    const [phone, setPhone] = useState("");
    const [joinedDate, setJoinedDate] = useState("");
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        setGuestEmail(localStorage.getItem("guestEmail") || "guest@example.com");
        setGuestName(localStorage.getItem("guestName") || "Guest");
        setPhone(localStorage.getItem("guestPhone") || "");
        setPhoto(localStorage.getItem("guestPhoto"));
        setJoinedDate("January 2025");
    }, []);

    const handleSave = () => {
        localStorage.setItem("guestName", guestName);
        localStorage.setItem("guestPhone", phone);
        setIsEditing(false);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            localStorage.setItem("guestPhoto", reader.result);
            setPhoto(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        localStorage.removeItem("guestPhoto");
        setPhoto(null);
    };

    return (
        <div className="container py-5">
            <div className="row g-4">

                {/* LEFT PROFILE CARD */}
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 p-4 text-center position-relative">

                        {/* AVATAR */}
                        <div
                            className="position-relative d-inline-block"
                            style={{ cursor: "pointer" }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{
                                        width: 110,
                                        height: 110,
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <FaUserCircle size={110} className="text-muted" />
                            )}

                            {/* CAMERA ICON */}
                            <div
                                className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: 32, height: 32 }}
                            >
                                <FaCamera size={14} />
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                        />

                        {photo && (
                            <button
                                className="btn btn-sm btn-outline-danger rounded-pill mt-3"
                                onClick={handleRemovePhoto}
                            >
                                Remove photo
                            </button>
                        )}

                        {/* NAME */}
                        {isEditing ? (
                            <input
                                className="form-control text-center fw-bold mt-3"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        ) : (
                            <h4 className="fw-bold mt-3 mb-1">{guestName}</h4>
                        )}

                        <p className="text-muted small mb-2">Traveler</p>

                        <div className="small text-muted">
                            <FaCalendarAlt className="me-1" />
                            Joined {joinedDate}
                        </div>
                    </div>
                </div>

                {/* RIGHT DETAILS */}
                <div className="col-md-8">
                    <div className="card shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Profile details</h5>

                        {/* EMAIL */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <div className="form-control bg-light">
                                <FaEnvelope className="me-2 text-muted" />
                                {guestEmail}
                            </div>
                        </div>

                        {/* PHONE */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Phone</label>
                            {isEditing ? (
                                <input
                                    className="form-control"
                                    value={phone}
                                    placeholder="Add phone number"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            ) : (
                                <div className="form-control bg-light">
                                    <FaPhone className="me-2 text-muted" />
                                    {phone || "Not added"}
                                </div>
                            )}
                        </div>

                        <hr />

                        {/* ACTIONS */}
                        <div className="d-flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        className="btn btn-dark rounded-pill"
                                        onClick={handleSave}
                                    >
                                        Save changes
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary rounded-pill"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-outline-dark rounded-pill"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
