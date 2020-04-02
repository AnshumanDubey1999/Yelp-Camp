var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    avatar: String,
    contact: Number,
    contactPrivacy : Boolean,
    email: {type: String, unique: true, required: true},
    emailPrivacy: Boolean,
    username: {type: String, unique: true, required: true},
    password: String,
    isAdmin: {type: Boolean, default: false}
})

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", UserSchema)