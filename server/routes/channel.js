const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  addChannel,
  deleteChannel,
  getChannels,
} = require("../controllers/channel");

router.route("/add").post(protect, addChannel);
router.route("/get").get(protect, getChannels);

module.exports = router;
