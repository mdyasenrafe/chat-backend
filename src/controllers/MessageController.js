const MessageModel = require("../models/MessageModel");
exports.fetchMessage = async (req, res) => {
  try {
    const { id } = req;
    const { receiverId } = req.query;

    const messages = await MessageModel.find({
      $or: [
        { $and: [{ senderId: id }, { receiverId: receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: id }] },
      ],
    }).sort({ createAt: 1 });

    res.status(200).json({ error: false, messages });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
