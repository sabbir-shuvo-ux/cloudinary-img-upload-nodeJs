const express = require("express");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const ImgDatabase = require("./model/imgUplod.model");

const app = express();

// CONSTANT DECLARATION
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.get("/", (req, res) => {
  res.send({ message: "hello there" });
});

app.post("/api/uploadImg", async (req, res) => {
  try {
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      if (err) {
        res.status(500).json(err);
      }

      const createdImg = new ImgDatabase({
        name: req.body.name,
        img: result.url,
      });

      const saveImg = await createdImg.save();

      res.status(200).json(saveImg);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

const dtabaseConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB CONNECTED");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

app.listen(PORT, async () => {
  console.log(`server is runing at http://localhost:${PORT}`);
  await dtabaseConnection();
});
