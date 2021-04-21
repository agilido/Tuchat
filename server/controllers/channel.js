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
      res.status(200).json(channels.channels);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
};
