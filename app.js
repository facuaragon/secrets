//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const User = require("./User");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

// session package
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

// use passsport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=>{console.log("Database connected")})
.catch((err)=>console.log(err))

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/", (req, res)=>{
    res.render("home")
})
app.get("/auth/google",
    passport.authenticate("google", {scope: ['profile']})
)
app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  }
);
app.get("/login", (req, res)=>{
    res.render("login")
})
app.get("/register", (req, res)=>{
    res.render("register")
})
app.get("/secrets", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("secrets")
    } else {
        res.redirect("/login")
    }
})
app.get("/logout", async (req, res)=>{
    try {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
          });
    } catch (error) {
        console.log(error);
    }
})


app.post("/register", async (req,res)=>{
    try {
        const {username, password} = req.body
        User.register({username, active: false}, password, (err,user)=>{
            if(err){
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, ()=>{
                    res.redirect("/secrets")
                })
            }
        })
        
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/login", async (req, res)=>{
    try {
        const {username, password} = req.body
        const user = new User({
            username: username,
            password: password
        })
        req.login(user, (err)=>{
            if(!err){
                passport.authenticate("local")(req, res, ()=>{
                    res.redirect("/secrets")
                })
            }
        })
    } catch (error) {
        console.log(err);
    }
    const user = new User({

    })
})


app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
})