const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
  photo: {
    type: String,
  },
});

const LoginModel = mongoose.model("login", LoginSchema);
module.exports = LoginModel;
