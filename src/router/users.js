const { getData, getDataById, deleteDataById, postData, putData, getDataDetail, login } = require("../controller/UsersController");
const express = require("express");
const router = express.Router();

router.get("/", getData);
router.get("/detail", getDataDetail);
router.get("/login", login);
router.post("/", postData);
router.put("/:id", putData);
router.get("/:id", getDataById);
router.delete("/:id", deleteDataById);

module.exports = router;
