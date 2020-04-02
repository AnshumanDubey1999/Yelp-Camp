var express = require("express")
var router = express.Router()
var passport = require("passport")
var bodyParser = require("body-parser")
var User = require("../models/user")


//AUTHENTICATE ROUTE
//SIGN UP
router.get("/register", function(req, res){
    res.render("register", {page: "register"})
})

router.post("/register", function(req, res){
    var passwordChecker = ((req.body.password).toString()).split(":AdminAuth:");
    var newUser = new User({
        username:           req.body.username,
        firstname:          req.body.firstname,
        lastname:           req.body.lastname,
        avatar:             req.body.avatar,
        contact:            req.body.contact,
        contactPrivacy :    req.body.contactPrivacy,
        email:              req.body.email,
        emailPrivacy:       req.body.emailPrivacy
    })
    if(passwordChecker.length==2){
        if(passwordChecker[1] === process.env.ADMIN_PASSWORD){
            newUser.isAdmin = true
        }
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        console.log("Past error detection!")
        passport.authenticate("local")(req, res, function(){
            console.log("New user Added!")
            console.log(newUser)
            req.flash("success", "Welcome to YelpCamp "+ user.username +"!")
            res.redirect("/campgrounds")
        })
    })
})

//LOG IN
router.get("/login", function(req, res){
    res.render("login", {page: "login"})
})

router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    console.log(req)
    console.log(res)
})

//LOGOUT
router.get("/logout", function(req, res){
    req.logOut()
    req.flash("success", "Logged Out Successfully!")
    res.redirect("/campgrounds")
})





router.get("/", function(req, res){
    res.render("home")
})

module.exports = router
