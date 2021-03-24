const express = require("express");
const router = express.Router();

const {
  login,
  register,
  fpassword,
  resetpassword,
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/fpassword").post(fpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

module.exports = router;
