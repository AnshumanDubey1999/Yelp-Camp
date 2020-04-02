var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seed"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user")

//ROUTES REQUIRED
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index"),
    userRoutes          = require("./routes/users")

require("dotenv").config()

//MONGOOSE CONFIGE
const uri = process.env.MONGODB_URI;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(uri, {useNewUrlParser: true});
mongoose.connection.on('open',()=>{
    console.log("Connection Established.. ")
})

mongoose.connection.on('error',()=>{
    console.log("Connection Failed.. ")
})


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"))
app.use(flash())

//SEED THE DATABASE
//seedDB()

//Moment Config
app.locals.moment = require('moment')

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){                  //Give currentUser to every ejs file
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")

    next()
})

app.use("/", indexRoutes)
app.use("/campgrounds" ,campgroundRoutes)
app.use("/users" ,userRoutes)
app.use("/campgrounds/:id/comments" ,commentRoutes)


app.listen(3000, function(){
    console.log("Yelp Camp is on FIRE!!!")
})