var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var User = require("../models/user")
var middleware = require("../middleware")





//INDEX
router.get("/", function(req, res){
    req.flash("error", "Invalid User ID!")
    res.redirect("/campgrounds")
})

//SHOW
router.get("/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            console.log(err)
            req.flash("error", "Invalid User ID!")
            res.redirect("/campgrounds")
        } else {
            Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
                if(err) {
                  req.flash("error", "Something went wrong.");
                  return res.redirect("/campgrounds");
                }
                res.render("users/show", {user: foundUser, campgrounds: campgrounds});
            })
        }
    })
})

//EDIT
router.get("/:id/edit", middleware.userOwnership, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                console.log(err)
                req.flash("error", "User not found!")
                res.redirect("/campgrounds")
            }else{
                console.log("User Found!")
                console.log(foundUser)
                res.render("users/edit", {user: foundUser})
            }
            
    })
    
})

//UPDATE
router.put("/:id", middleware.userOwnership, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err || !updatedUser){
            req.flash("error", "User not found!")
            res.redirect("/campgrounds")
        } else {
            console.log("Updated User:")
            console.log(updatedUser)
            req.flash("success", "User Updated!")
            res.redirect("/users/"+req.params.id)
        }
    })
})

//DESTROY
router.delete("/:id", middleware.userOwnership, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
       
        if(err || !foundUser){
            req.flash("error", "User not found!")
            res.redirect("/Users")
        }
        else{
            req.logOut()
            foundUser.delete()
            console.log("User Deleted!")
            req.flash("success", "User Deleted!")
            res.redirect("/campgrounds")
        }
        
    })
})

module.exports = router
