const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/mongoDatabase";

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}); 

if (url) 
    console.log("Connected to database.");
else
    console.log("Can't connect to database.");