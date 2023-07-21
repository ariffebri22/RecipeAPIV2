const { getData, getDataById, deleteDataById, postData, putData, getDataDetail } = require("../controller/CategoryController");
const express = require("express");
const router = express.Router();

router.get("/", getData);
router.get("/detail", getDataDetail);
router.post("/", postData);
router.put("/:id", putData);
router.get("/:id", getDataById);
router.delete("/:id", deleteDataById);

module.exports = router;
