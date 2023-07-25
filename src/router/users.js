const express = require("express");
const router = express.Router();
const { getData, getDataById, deleteDataById, postData, putData, getDataDetail, login } = require("../controller/UsersController");
const { Protect } = require("./../middleware/Protect");

router.get("/", Protect, getData);
router.get("/detail", Protect, getDataDetail);
router.get("/login", login);
router.post("/", postData);
router.put("/:id", Protect, putData);
router.get("/:id", Protect, getDataById);
router.delete("/:id", Protect, deleteDataById);

module.exports = router;
