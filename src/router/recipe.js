const { getData, getDataById, deleteDataById, postData, putData, getDataDetail } = require("../controller/RecipeController");
const express = require("express");
const router = express.Router();
const { Protect } = require("./../middleware/Protect");

router.get("/", Protect, getData);
router.get("/detail", getDataDetail);
router.post("/", Protect, postData);
router.put("/:id", Protect, putData);
router.get("/:id", getDataById);
router.delete("/:id", Protect, deleteDataById);

module.exports = router;
