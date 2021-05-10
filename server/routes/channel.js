const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  addChannel,
  deleteChannel,
  getUserChannels,
  getAllChannels,
  getExactChannel,
  starChannel,
  newMessage,
  joinChannel,
} = require("../controllers/channel");

router.route("/add").post(protect, addChannel);
router.route("/get").get(protect, getUserChannels);
router.route("/getall").get(protect, getAllChannels);
router.route("/star").post(protect, starChannel);
router.route("/newmessage").post(protect, newMessage);
router.route("/joinchannel").post(protect, joinChannel);

router.route("/:channelId").get(protect, getExactChannel);

module.exports = router;
