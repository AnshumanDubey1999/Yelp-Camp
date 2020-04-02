var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")





//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err || !campgrounds){
            console.log("Error Occured")
            req.flash("error", "Couldn't load Campgrounds!")
            res.redirect("/")
        }
        else{
            res.render("campgrounds/index", {campgrounds : campgrounds, page: "campgrounds"})
        }
    })
})

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create(
        {
            name: req.body.name,
            image : req.body.image,
            description : req.body.description,
            price : req.body.price,
            author: author
        }, function(err, campground){
            if(err){
                console.log("Error Occured")
                req.flash("error", "Error Occured while adding Campground!")
            }
            else{
                console.log("Successfully saved")
                console.log(campground)
                req.flash("success", "Campground Successfully Added!")
            }
        }
    )
    res.redirect("/campgrounds")
})

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})

//SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err)
            req.flash("error", "Campground not found!")
            res.redirect("/campgrounds")
        } else {
            console.log("Current User:")
            console.log(req.user);
            res.render("campgrounds/show", {campground:foundCampground})
        }
    })
})

//EDIT
router.get("/:id/edit", middleware.campgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                console.log(err)
                req.flash("error", "Campground not found!")
                res.redirect("campgrounds/")
            }else{
                res.render("campgrounds/edit", {campground: foundCampground})
            }
            
    })
    
})

//UPDATE
router.put("/:id", middleware.campgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err || !updatedCampground){
            req.flash("error", "Campground not found!")
            res.redirect("/campgrounds")
        } else {
            console.log("Updated Campground:")
            console.log(updatedCampground)
            req.flash("success", "Campground Updated!")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//DESTROY
router.delete("/:id", middleware.campgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       
        if(err || !foundCampground){
            req.flash("error", "Campground not found!")
            res.redirect("/campgrounds")
        }
        else{
            foundCampground.comments.forEach(function(commentId){
                Comment.findByIdAndDelete(commentId, function(err){
                    if(err){
                        console.log("Comment Deletion Failed!")
                    }
                    else{
                        console.log("Comment Deleted!")
                    }
                })
            })
            foundCampground.delete()
            console.log("Campground Deleted!")
            req.flash("success", "Campground Deleted!")
            res.redirect("/campgrounds")
        }
        
    })
})

module.exports = router
