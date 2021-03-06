const mongoose = require("mongoose"); 

const ChatSchema = new mongoose.Schema({
    chatId: String,
    chatName: String,
    messagesByDate: [{
        date:String,
        messages:[{
            Id:String,
            message: String,
            time: Number,
            readBy: [{
                _id: false
            }]
        }]
    }]
});

module.exports = mongoose.model("GroupChat", ChatSchema);
