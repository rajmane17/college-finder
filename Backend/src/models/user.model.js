const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        // we can pass custom error message if we want
        required: [true, "Password is required"],
    },
    city: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    applicantType: {
        type: String,
        enum: ["admission seeker", "reviewer"],
        required: true
    },
    avatar: {
        type: String, // we will store the image in cloudinary aur yaha bs url store hoga
        required: true
    },
    coverImage: {
        type: String,
    },
    refreshToken: {
        type: String
    },
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.checkPassword= async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);

module.exports = User