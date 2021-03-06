const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatId: String,
  chatName: String,
  members: [
    {
      _id: false,
      userId: String,
      username: String,
    },
  ],
  messagesByDate: [
    {
      date: String,
      messages: [
        {
          _id: false,
          Id: String,
          message: String,
          time: Number,
          readBy: [
            {
              _id: false,
              userId: String,
              username: String,
            },
          ],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("GroupChat", ChatSchema);
