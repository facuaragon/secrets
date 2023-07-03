require("dotenv").config();
const secret = process.env.SECRET

const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

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

userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

module.exports = User
