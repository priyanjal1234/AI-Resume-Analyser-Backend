import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import upload from "./config/multerConfig.js";
import cloudinary from "./config/cloudinary.js";
import extractText from "./utils/extractText.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post(
  "/api/upload-resume",
  (req, res, next) => {
    console.log("Request received... Checking multer middleware.");
    next(); // Pass control to multer middleware
  },
  upload.single("resume"),
  async function (req, res) {
    try {
      console.log("Request comes... ");
      if (!req.file) {
        return res.status(400).json({ message: "Resume File is required" });
      }
      console.log(req.file);
      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        type: "upload",
      });

      const extractRes = await extractText(
        cloudinaryRes.secure_url,
        req.file.mimetype
      );

      return res.status(200).json({
        message: "Resume Uploaded Successfully",
        resume: req.file,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
