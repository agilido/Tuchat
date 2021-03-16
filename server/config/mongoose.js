const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true
}); 

if (url) 
    console.log("Connected to database.");
else
    console.log("Can't connect to database.");