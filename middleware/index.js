var Campground = require("../models/campground")
var Comment = require("../models/comment")
var User = require("../models/user")
middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You need to be Logged In to do that!")
    res.redirect("/login")
}

middlewareObj.campgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found!")
                res.redirect("/campgrounds")
            } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect("back")
            }
        })
    }
    else{
        req.flash("error", "You need to be Logged In to do that!")
        res.redirect("/login")
    }
}

middlewareObj.userOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("error", "User not found!")
                res.redirect("/Users")
            } else if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect("back")
            }
        })
    }
    else{
        req.flash("error", "You need to be Logged In to do that!")
        res.redirect("/login")
    }
}

middlewareObj.commentOwnership = function(req, res, next){
    console.log("Inside commentOwnership")
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log("Error Occured in commentOwnership")
                req.flash("error", "Comment not found!")
                console.log(err)
                res.redirect("back")
            } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else{
                console.log("Match not found!")
                req.flash("error", "You don't have permission to do that!")
                res.redirect("back")
            }
        })
    }
    else{
        console.log("Match not found!")
        req.flash("error", "You need to be Logged In to do that!")
        res.redirect("/login")
    }
}

middlewareObj.campgroundOrCommentOwnership = function(req, res, next){
    console.log("Inside campgroundOwnership")
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                console.log("Error Occured in campgroundOwnership")
                console.log(err)
                middlewareObj.commentOwnership(req, res, next)
            } else if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else{
                console.log("Match not found!")
                middlewareObj.commentOwnership(req, res, next)
            }
        })
    }
    else{
        console.log("Match not found!")
        req.flash("error", "You need to be Logged In to do that!")
        middlewareObj.commentOwnership(req, res, next)
    }
}


module.exports = middlewareObj