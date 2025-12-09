// src/owners/AddHotel.jsx
import { useState } from "react";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AddHotel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    pricePerNight: "",
    description: "",
    amenities: [],
    images: [],
  });

  const [localImages, setLocalImages] = useState([]);

  const amenitiesList = [
    "Free WiFi",
    "Parking",
    "Airport Shuttle",
    "Swimming Pool",
    "Restaurant",
    "Fitness Center",
    "Air Conditioning",
    "Room Service",
  ];

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (a) => {
    const updated = form.amenities.includes(a)
      ? form.amenities.filter((x) => x !== a)
      : [...form.amenities, a];

    setForm({ ...form, amenities: updated });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setLocalImages(files);
  };

  const uploadImagesToCloudinary = async () => {
    const urls = [];
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    for (const file of localImages) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", preset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );

      urls.push(res.data.secure_url);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];

      if (localImages.length > 0) {
        imageUrls = await uploadImagesToCloudinary();
      }

      const token = localStorage.getItem("ownerToken");

      const payload = {
        ...form,
        images: imageUrls,
      };

      await axios.post(`${API}/api/owner/hotels/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Hotel added successfully!");
      navigate("/owner/my-hotels");
    } catch (err) {
      console.error("Error adding hotel:", err);
      alert("Error adding hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout active="add-hotel">
      <div className="add-hotel-card shadow-sm">

        <h3 className="fw-bold mb-4">Add New Hotel</h3>

        <form onSubmit={handleSubmit} className="row g-4">

          {/* LEFT COLUMN */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Hotel Name</label>
            <input
              name="name"
              type="text"
              className="form-control form-control-lg custom-input"
              value={form.name}
              onChange={updateField}
              required
            />

            <label className="form-label fw-semibold mt-4">City</label>
            <input
              name="city"
              type="text"
              className="form-control custom-input"
              value={form.city}
              onChange={updateField}
              required
            />

            <label className="form-label fw-semibold mt-4">Country</label>
            <input
              name="country"
              type="text"
              className="form-control custom-input"
              value={form.country}
              onChange={updateField}
              required
            />

            <label className="form-label fw-semibold mt-4">
              Price Per Night ($)
            </label>
            <input
              name="pricePerNight"
              type="number"
              className="form-control custom-input"
              value={form.pricePerNight}
              onChange={updateField}
              required
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              rows="6"
              className="form-control custom-input"
              value={form.description}
              onChange={updateField}
              required
            ></textarea>

            <label className="form-label fw-semibold mt-4">Amenities</label>
            <div className="d-flex flex-wrap gap-3">
              {amenitiesList.map((a) => (
                <div key={a} className="form-check amenity-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <label className="form-check-label">{a}</label>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="col-12">
            <label className="form-label fw-semibold">Upload Images</label>

            <div className="upload-box mb-3">
              <input
                type="file"
                multiple
                className="form-control upload-input"
                onChange={handleImageSelect}
              />
              <p className="text-muted m-0">Click to browse or drag & drop</p>
            </div>

            {/* PREVIEW */}
            <div className="d-flex flex-wrap gap-3 mt-2">
              {localImages.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="preview-img"
                />
              ))}
            </div>
          </div>

          <div className="col-12 mt-3">
            <button
              type="submit"
              className="btn btn-primary px-5 py-2 rounded-pill fw-semibold submit-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add Hotel"}
            </button>
          </div>

        </form>
      </div>

      {/* STYLES */}
      <style>{`
                .add-hotel-card {
                    background: #fff;
                    border-radius: 16px;
                    padding: 30px;
                    max-width: 900px;
                    margin: auto;
                }

                .custom-input {
                    border-radius: 10px;
                    padding: 10px 14px;
                }

                .amenity-check input {
                    cursor: pointer;
                }

                .amenity-check label {
                    margin-left: 6px;
                    cursor: pointer;
                    font-weight: 500;
                }

                .upload-box {
                    border: 2px dashed #c9c9c9;
                    padding: 25px;
                    text-align: center;
                    border-radius: 14px;
                    transition: 0.3s;
                    cursor: pointer;
                }

                .upload-box:hover {
                    border-color: #007bff;
                    background: #f8faff;
                }

                .preview-img {
                    width: 140px;
                    height: 110px;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .submit-btn {
                    font-size: 17px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
                }
            `}</style>
    </OwnerLayout>
  );
}
