require("dotenv").config({ path: "./config.env" });
const express = require("express");
const errorHandler = require("./middleware/error");
const app = express();

const PORT = process.env.PORT || 5000;

// Mongo
require("./config/mongoose");

// Routes
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/channel", require("./routes/channel"));
app.use("/api/private", require("./routes/private"));

app.use(errorHandler);

// Socket.io
const io = require("socket.io")(3000);
io.on("connection", (socket) => {
  socket.emit("chatmsg", "wussup");
});

app.get("/", function (req, res, next) {
  res.json({
    status: "Loaded!",
  });
});

app.listen(PORT, () => {
  console.log("Listening!");
});
