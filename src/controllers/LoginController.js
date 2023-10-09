const generateToken = require("../middlewares/GenerateToken");
const LoginModel = require("../models/LoginModel");
const bcrypt = require("bcrypt");

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await LoginModel.findOne({ email: email });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user?.password);
        const token = generateToken(user?.email, user?._id);
        if (isValidPassword) {
          res.status(200).send({
            error: false,
            data: user,
            message: "Login successful",
            token: token,
          });
        } else {
          res.status(200).send({
            error: true,
            message: "Invalid password",
          });
        }
      }
    } else {
      res
        .status(200)
        .send({ error: true, message: "Please enter email and password" });
    }
  } catch (error) {
    res.status(200).send({ error: true, message: error?.message });
  }
};

exports.signUpUser = async (req, res) => {
  try {
    let hashedPassword;
    if (req.body?.password && req.body?.email) {
      let newPassword = req?.body?.password?.toString();
      hashedPassword = await bcrypt?.hash(newPassword, 10);
    } else {
      res.status(200).send({
        error: true,
        message: "Please enter a password and email",
      });
    }
    req.body.password = hashedPassword;
    console.log(req.body);
    const newUser = new LoginModel(req.body);
    await newUser.save();
    res.status(200).send({
      error: false,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(200).send({ error: true, message: error?.message });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const { id } = req;
    const users = await LoginModel.find({ _id: { $ne: id } });
    res.status(200).send({ error: false, data: users });
  } catch (error) {
    res.status(200).send({ error: true, message: error?.message });
  }
};
