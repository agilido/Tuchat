const express = require("express");
const app = express();

require("./config/mongoose");

app.get("/", function (req, res, next) {
  res.json({
    status: "Loaded!",
  });
});

app.listen(8080, function () {
  console.log("Listening!");
});
