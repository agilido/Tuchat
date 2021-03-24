const crypto = require("crypto");
const { findOne } = require("../models/User");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ErrorResponse("Please enter credentials", 400));
  }

  try {
    const userByUsername = await User.findOne({ username }).select("+password");

    if (!userByUsername) {
      const userByMail = await User.findOne({ email }).select("+password");

      if (userByMail) {
        const isMatch = await userByMail.matchPasswords(password);
        if (!isMatch) {
          return next(new ErrorResponse("Invalid credentials", 401));
        }
        return sendToken(userByMail, 200, res);
      }

      return next(new ErrorResponse("Invalid credentials xD", 401));
    }

    const isMatch = await userByUsername.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(userByUsername, 200, res);
  } catch (error) {
    next(error);
  }
};

// Forgot password

exports.fpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent"), 404);
    }
    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    const message = `<h1> Password reset requested. </h1>
    <p> Click here to reset your password </p>
    
    <a href=${resetUrl} clicktracking=off>Reset password</a>`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset request",
        text: message,
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email couldn't be send"), 500);
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token"), 400);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({ success: true, data: "Password reset success" });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
