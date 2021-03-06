const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const GroupChatSchema = new mongoose.Schema({
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

//Export the model
module.exports = mongoose.model("GroupChat", GroupChatSchema);
