const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require('mongoose-validator');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "",
    validate: [
      validator({
        validator: "isEmail",
        message: "Please enter valid email."
      })
    ],
  },
  password: {
    type: String,
    required: true,
    default: "",
  },
  channels: [
    {
      channelId: String,
      channelName: String,
      favorite: Boolean,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.matchPasswords = async function(password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", UserSchema);
