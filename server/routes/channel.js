const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  addChannel,
  deleteChannel,
  getChannels,
  getExactChannel,
  starChannel,
  newMessage,
} = require("../controllers/channel");

router.route("/add").post(protect, addChannel);
router.route("/get").get(protect, getChannels);
router.route("/star").post(protect, starChannel);
router.route("/newmessage").post(protect, newMessage);

router.route("/:channelId").get(protect, getExactChannel);

module.exports = router;
