const User = require("../models/User");
const Channel = require("../models/Channel");

exports.addChannel = async (req, res, next) => {
  const channelData = req.body.channelData;

  const userId = req.user._id;
  const username = req.user.username;

  channelData.owner = {
    userId: userId,
    username: username,
  };

  if (channelData && userId) {
    try {
      const userChannelsUpdate = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            channels: {
              channelId: channelData.channelId,
              channelName: channelData.name,
              favorite: false,
            },
          },
        },
        { new: true }
      );
      const channelNew = new Channel(channelData);
      await channelNew.save((result) => {
        console.log(result);
      });

      return res.status(200).json(userChannelsUpdate.channels);
    } catch (error) {
      return res.status(500).json({ err: error.message + "xD" });
    }
  }
};

exports.getChannels = async (req, res, next) => {
  const userId = req.user._id;
  if (userId) {
    try {
      const channels = await User.findById(userId);
      return res.status(200).json(channels.channels);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
};

exports.starChannel = async (req, res, next) => {
  const userId = req.user._id;
  const channelId = req.body.channId;
  const favoriteStan = req.body.favoriteStan;

  if (userId && channelId) {
    try {
      await User.findOneAndUpdate(
        { _id: userId, "channels.channelId": channelId },
        {
          $set: {
            "channels.$.favorite": !favoriteStan,
          },
        },
        { new: true }
      );
      return res.status(200).json({ msg: "Channel added to favorites" });
    } catch (error) {
      return res.status(500).json({ err: error.message + "xD" });
    }
  }
};
exports.newMessage = async (req, res, next) => {
  const userId = req.user._id;
  const username = req.user.username;
  const messageData = req.body.newMessage;

  if (messageData) {
    const channel = await getChannel(req, res);

    const date = new Date().toLocaleDateString();

    const channelMsgs = channel.messagesByDate;

    const sameDateMessages = channelMsgs.find((chDate) => chDate.date === date);

    messageData.from = { userId: userId, username: username };

    if (sameDateMessages) {
      sameDateMessages.messages.push(messageData);
    } else {
      const newDateMessages = {
        date: date,

        messages: [messageData],
      };
      channelMsgs.push(newDateMessages);
    }

    try {
      await channel.save();
      return res.status(200).json({ msg: "Message sent successfully" });
    } catch (error) {
      return res.status(500).json({ err: error.message });
    }
  }
};

exports.getExactChannel = async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const exactChannel = await Channel.findOne({ channelId: channelId });
    return res.status(200).json({ channel: exactChannel });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const getChannel = async (req, res) => {
  const channelId = req.body.channId;
  try {
    const exactChannel = await Channel.findOne({ channelId: channelId });
    return exactChannel;
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
