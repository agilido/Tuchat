const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value) {
            if (value !== /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) {
                throw new Error("Not an email.")
            }
        }
    },
    password:{
        type:String,
        required:true,
    }
});

//Export the model
module.exports = mongoose.model('User', userSchema);