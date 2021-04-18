const express = require("express");
const router = express.Router();

const { addChannel, deleteChannel } = require("../controllers/channel");

router.route("/add").post(addChannel);

module.exports = router;
