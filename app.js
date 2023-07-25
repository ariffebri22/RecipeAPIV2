const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Router = require("./src/router");
const helmet = require("helmet");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./src/config/cloud");

const port = 4000;
const app = express();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "RecipeAPIV2",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        const error = new Error("Unsupported file type");
        error.status = 400;
        cb(error, false);
    }
};

const maxSize = 2.5 * 1024 * 1024;

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: maxSize } });

// Middleware untuk mengizinkan CORS
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "server running" });
});
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ status: 400, message: "File size should be less than 2.5 MB" });
        }
    } else if (err.message === "Unsupported file type") {
        return res.status(400).json({ status: 400, message: "Unsupported file type" });
    }

    next(err);
});

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "server running" });
});

// Use the upload middleware for file upload
app.use(upload.single("photo"));

app.use(Router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
