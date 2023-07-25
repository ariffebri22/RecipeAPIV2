const cloudinary = require("../config/cloud");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

module.exports = upload;
