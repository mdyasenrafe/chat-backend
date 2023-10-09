const express = require("express");
const { signUpUser, handleLogin } = require("../controllers/LoginController");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", handleLogin);

module.exports = router;
