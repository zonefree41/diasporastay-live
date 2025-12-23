// src/owners/AddHotel.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";


export default function AddHotel() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [minNights, setMinNights] = useState(2);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("ownerToken");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("pricePerNight", pricePerNight);
      formData.append("minNights", minNights);
      formData.append("description", description);

      for (const file of images) {
        formData.append("images", file);
      }

      await api.post("/api/hotels", formData);
      alert("Hotel added successfully");

      navigate("/owner/my-hotels");
    } catch (err) {
      console.error(err);
      alert("Failed to add hotel");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1>Add Hotel</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Hotel name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />

        <input
          type="number"
          placeholder="Price per night"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Minimum nights"
          value={minNights}
          onChange={(e) => setMinNights(e.target.value)}
        />

        <textarea
          rows={4}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />

        <button type="submit">Add Hotel</button>
      </form>
    </div>
  );
}
