import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import upload from "./config/multerConfig.js";
import cloudinary from "./config/cloudinary.js";
import extractText from "./utils/extractText.js";
import getAIResumeFeedback from "./utils/getAIFeedback.js";

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
  "/api/get-feedback",

  upload.single("resume"),
  async function (req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Resume File is required" });
      }

      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        type: "upload",
      });

      const extractRes = await extractText(
        cloudinaryRes.secure_url,
        req.file.mimetype
      );

      let result = await getAIResumeFeedback(extractRes);

      return res.status(200).json({
        message: "Resume Uploaded Successfully",
        feedback: result,
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
