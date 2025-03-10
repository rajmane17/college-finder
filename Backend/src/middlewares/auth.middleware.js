const {ApiError} = require("../utils/apiError")
const {asyncHandler} = require("../utils/asyncHandler")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error || "Invalid access token")
    }
    
})

const isReviewer = asyncHandler((req, res, next) => {})

module.exports = {verifyJWT, isReviewer}