const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Router = require("./src/router");
const helmet = require("helmet");
const xss = require("xss");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const port = 4000;
const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

// const fileStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "RecipeAPIV2", // Nama folder di Cloudinary untuk menyimpan file foto recipe
//         allowed_formats: ["png", "jpg", "jpeg"], // Hanya izinkan tipe file png, jpg, dan jpeg
//         format: async (req, file) => "jpg", // Konversi semua file yang diunggah menjadi format jpg
//         public_id: (req, file) => `recipe_${Date.now()}`, // Nama unik file di Cloudinary
//     },
// });

// const fileFilter = function (req, file, cb) {
//     const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("File format not supported"));
//     }
// };

app.use(helmet());

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("photo"));

app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "server running" });
});

app.use(Router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
