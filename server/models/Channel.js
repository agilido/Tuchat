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
});

module.exports = mongoose.model("Channel", ChannelSchema);
