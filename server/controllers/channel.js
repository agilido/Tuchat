const User = require("../models/User");

exports.addChannel = async (req, res, next) => {
  const channelData = req.body;
  console.log(channelData);
  return res.status(200).json(channelData);
};
