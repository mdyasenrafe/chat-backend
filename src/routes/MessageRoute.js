const express = require("express");
const checkLogin = require("../middlewares/CheckLogin");
const { fetchMessage } = require("../controllers/MessageController");
const router = express.Router();

router.get("/fetchMessage", checkLogin, fetchMessage);

module.exports = router;
