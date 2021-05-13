require("dotenv").config({ path: "./config.env" });
const express = require("express");
const errorHandler = require("./middleware/error");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 5000;

// Mongo
require("./config/mongoose");

// Routes
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/channel", require("./routes/channel"));
app.use("/api/private", require("./routes/private"));

app.use(errorHandler);

app.get("/", function (req, res, next) {
  res.json({
    status: "Loaded!",
  });
});

server.listen(PORT, () => {
  console.log("Listening on " + PORT);
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("joinChannels", (userChannels) => {
    userChannels.forEach((userChannels) => {
      socket.join(userChannels.channelId);
    });
  });

  socket.on("leaveChannels", (userChannels) => {
    socket.leave(userChannels);
  });

  socket.on("leaveChannel", (channel) => {
    socket.leave(channel.channelId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.channelId).emit("message", data);
  });
});
