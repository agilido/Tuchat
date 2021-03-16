require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();


const PORT = process.env.PORT || 5000;

require("./config/mongoose");

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

app.get("/", function (req, res, next) {
  res.json({
    status: "Loaded!",
  });
});

app.listen(PORT, () => {
  console.log("Listening!");
});
