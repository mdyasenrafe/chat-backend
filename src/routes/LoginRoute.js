const express = require("express");
const {
  signUpUser,
  handleLogin,
  fetchUsers,
  FetchMe,
} = require("../controllers/LoginController");
const checkLogin = require("../middlewares/CheckLogin");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", handleLogin);
router.get("/users", checkLogin, fetchUsers);
router.get("/me", checkLogin, FetchMe);

module.exports = router;
