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
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please enter email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(user, 200, res);
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

    const resetUrl = `http://localhost:${process.env.PORT}/passreset/${resetToken}`;

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

exports.resetpassword = (req, res, next) => {
  res.send("Reset password route");
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
