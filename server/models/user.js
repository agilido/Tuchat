const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: '',
    validate(value) {
      if (value !== /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) {
        throw new Error("Not an email.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    default: ''
  },
  channels: [{
    channelId: String,
    channelName: String,
    favorite: Boolean
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

//Export the model
module.exports = mongoose.model("User", UserSchema);
