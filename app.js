require("dotenv").config();

const express = require("express");
const path = require("path");
const multer = require("multer");

const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");

const app = express();

const upload = multer({
  storage: multer.memoryStorage()
});

app.use(express.static("public"));

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", upload.single("file"), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file selected"
      });
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      })
    );

    res.json({
      message: "File uploaded to S3 successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Upload failed"
    });
  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});