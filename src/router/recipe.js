const { getData, getDataById, deleteDataById, postData, putData, getDataDetail } = require("../controller/RecipeController");
const express = require("express");
const router = express.Router();
const { Protect } = require("./../middleware/Protect");
const upload = require("../helper/uploadCloudinary");

router.get("/", Protect, getData);
router.get("/detail", getDataDetail);
router.post("/", Protect, upload.single("photo"), postData);
router.put("/:id", Protect, upload.single("photo"), putData);
router.get("/:id", getDataById);
router.delete("/:id", Protect, deleteDataById);

module.exports = router;
