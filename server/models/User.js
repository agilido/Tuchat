const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("mongoose-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
        message: "Please enter valid e-mail address",
      }),
    ],
  },
  password: {
    type: String,
    required: true,
    default: "",
  },
  channels: [
    {
      _id: false,
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

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
