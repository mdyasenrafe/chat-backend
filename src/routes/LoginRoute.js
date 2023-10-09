const express = require("express");
const {
  signUpUser,
  handleLogin,
  fetchUsers,
} = require("../controllers/LoginController");
const checkLogin = require("../middlewares/CheckLogin");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", handleLogin);
router.get("/users", checkLogin, fetchUsers);

module.exports = router;
