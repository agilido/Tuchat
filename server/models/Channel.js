const mongoose = require("mongoose"); 

const ChannelSchema = new mongoose.Schema({
    channelId: String,
    channelName: String,
    owner: {
        userId: String,
        username: String
    },
    channelDescription: String,
    members: [{
        userId: String,
        username: String
    }]
});

module.exports = mongoose.model("GroupChat", ChannelSchema);
