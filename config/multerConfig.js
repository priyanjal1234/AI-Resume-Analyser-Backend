import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // Ensures raw documents (Word files) are uploaded
  },
});

// ✅ **Explicitly filter allowed files**
const fileFilter = (req, file, cb) => {
  const allowedFormats = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/msword", // DOC
  ];

  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only DOCX and DOC are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;
