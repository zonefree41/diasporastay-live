import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary credentials (already in your env)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 PERMANENT IMAGE TRANSFORMATION
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "diasporastay/hotels",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            {
                width: 1200,
                height: 900,
                crop: "fill",
                gravity: "center",
                quality: "auto",
                fetch_format: "auto",
            },
        ],
    },
});

// ✅ Export this — we’ll use it in routes
export const upload = multer({ storage });
