const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  addChannel,
  deleteChannel,
  getChannels,
  starChannel,
  newMessage,
} = require("../controllers/channel");

router.route("/add").post(protect, addChannel);
router.route("/get").get(protect, getChannels);
router.route("/star").post(protect, starChannel);
router.route("/newmessage").post(protect, newMessage);

module.exports = router;
