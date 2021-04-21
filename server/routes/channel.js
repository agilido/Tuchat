const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { addChannel, deleteChannel } = require("../controllers/channel");

router.route("/add").post(protect, addChannel);

module.exports = router;
