//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")


const User = require("./User");
const { constants } = require("buffer");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=>console.log("Database connected"))
.catch((err)=>console.log(err))



app.get("/", (req, res)=>{
    res.render("home")
})
app.get("/login", (req, res)=>{
    res.render("login")
})
app.get("/register", (req, res)=>{
    res.render("register")
})


app.post("/register", async (req,res)=>{
    try {
        const {username, password} = req.body
        const newUser = new User({
            email: username,
            password: password
        })
        await newUser.save()
        res.render("secrets");
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/login", async (req, res)=>{
    try {
        const {username, password} = req.body
        const foundUser = await User.findOne({email: username})
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets")
            }
        }
    } catch (error) {
        console.log(error.message);
    }
})


app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
})