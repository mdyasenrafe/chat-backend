const LoginModel = require("../models/LoginModel");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email + " " + password);
    if (email && password) {
      const user = await LoginModel.findOne({ email: email });
      if (user) {
        const ValidPassword = await bcrypt.compare(password, user?.password);
        if (ValidPassword) {
          res.status(200).send({
            error: false,
            data: user,
            message: "Login successfully",
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
  } catch (err) {
    res.status(200).send({ error: true, message: err?.message });
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
        message: "Please enter password and email",
      });
    }
    req.body.password = hashedPassword;
    console.log(req.body);
    const newData = new LoginModel(req.body);
    await newData.save();
    res.status(200).send({
      error: false,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(200).send({ error: true, message: err?.message });
  }
};
