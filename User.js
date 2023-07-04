require("dotenv").config();
const secret = process.env.SECRET

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const passport = require("passport")



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);


module.exports = User
