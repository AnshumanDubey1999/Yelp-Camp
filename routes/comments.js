var express = require("express")
var router = express.Router({mergeParams: true})
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")



//CREATE
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Campground not found!")
            console.log(err)
            res.redirect("/campgrounds")
        }
        else{
            res.render("comments/new", {campground : campground})
        }
    })
})


router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err)
            req.flash("error", "Error occured while adding comment!")
            res.redirect("/campgrounds")
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Error occured while adding comment!")
                    console.log(err)
                    res.redirect("/campgrounds")
                }
                else{
                    //add username & id to comment
                    console.log(req.user)
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username
                    comment.save()
                    console.log(comment)
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success", "Comment Successfully Added!")
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
})

//EDIT 
router.get("/:comment_id/edit", middleware.commentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Error occured while adding comment!")
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            console.log("Campground id"+req.params.id)
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id})
        }
        
    })
})

//UPDATE
router.put("/:comment_id", middleware.commentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || ! updatedComment){
            req.flash("error", "Error occured while updating comment!")
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            console.log("Updated Comment:")
            console.log(updatedComment)
            req.flash("success", "Comment Updated!")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//DESTROY
router.delete("/:comment_id", middleware.campgroundOrCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err)
            req.flash("error", "Comment not found!")
        } else {
            console.log("Comment Deleted!")
            req.flash("success", "Comment Deleted!")
        }
        
    })
    res.redirect("/campgrounds/"+req.params.id)
})


module.exports = router