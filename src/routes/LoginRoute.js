const express = require("express");
const { signUpUser, loginUser } = require("../controllers/LoginController");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", loginUser);

module.exports = router;
