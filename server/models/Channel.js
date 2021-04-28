const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  channelId: String,
  name: String,
  description: String,
  owner: {
    userId: String,
    username: String,
  },
  members: [
    {
      _id: false,
      userId: String,
      username: String,
    },
  ],
  messagesByDate: [
    {
      _id: false,
      date: String,
      messages: [
        {
          _id: false,
          _id: String,
          messageId: String,
          from: {
            userId: String,
            username: String,
          },
          message: String,
          time: Number,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Channel", ChannelSchema);
