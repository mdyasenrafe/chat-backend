const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  senderId: {
    type: String,
  },
  receiverId: {
    type: String,
  },
  text: {
    type: String,
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
});

const MessageModel = mongoose.model("message", MessageSchema);
module.exports = MessageModel;
