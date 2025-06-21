import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dhz0pkov6",
  api_key: "423828186226757",
  api_secret: "tgL1zylZb1axBdWWmcWHG0wu9cE",
});

let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "helana", // Cloudinary folder
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} catch (error) {
  console.error("CloudinaryStorage error:", error);
  throw error;
}

const upload = multer({ storage });

export default upload;
