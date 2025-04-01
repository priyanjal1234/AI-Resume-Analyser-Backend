import fs from "fs";
import axios from "axios";
import mammoth from "mammoth";
import path from "path";
import os from "os";

async function extractText(fileUrl, fileType) {
  try {
    console.log("Downloading file from:", fileUrl);

    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "arraybuffer",
    });

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, "temp_resume.docx");

    fs.writeFileSync(tempFilePath, response.data);
    console.log("File saved temporarily at:", tempFilePath);

    const result = await mammoth.extractRawText({ path: tempFilePath });

    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log("Temporary file deleted.");
    }

    return result.value;
  } catch (error) {
    console.error("Error extracting text:", error);

    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log("Temporary file deleted after error.");
    }

    throw new Error("Failed to extract text from document.");
  }
}

export default extractText;
