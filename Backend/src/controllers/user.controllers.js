const User = require("../models/user.model");
const cloudinary = require("cloudinary");

// utils import
const {uploadOnCloudinary, deleteFromCloudinary} = require("../utils/cloudinary");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const bcrypt = require("bcrypt")


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const handleUserSignup = asyncHandler(async (req, res) => {
    const { fullName, email, city, password, applicantType } = req.body;

    if (
        [fullName, email, city, password, applicantType].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (!["admission seeker", "reviewer"].includes(applicantType)) {
        throw new ApiError(400, "Invalid applicant type. Must be either 'admission seeker' or 'reviewer'")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with this email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        city,
        applicantType
    })

    //In this function the refresh token is being set automatically and we are taking accessToken here.
    const { accessToken } = await generateAccessAndRefereshTokens(user._id);


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200,
                {
                    createdUser, accessToken
                },
                "User registered Successfully")
        )
})

const handleUserLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Please enter both email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const validatePass = await user.checkPassword(password);

    if (!validatePass) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
})

const handleUserLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true // return updated document instead of original
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

const handleAvatarChange = asyncHandler(async (req, res) => {
    // Check if files exist in request
    if (!req.files || !req.files.avatar || !req.files.avatar.length > 0) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // Delete old avatar from cloudinary (optional but recommended)
    const user = await User.findById(req.user._id);
    if (user.avatar) {
        // Extract public_id from the old avatar URL
        const oldAvatarPublicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldAvatarPublicId);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"))
});

const handleCoverImgChange = asyncHandler(async (req, res) => {
    // Check if files exist in request
    if (!req.files || !req.files.coverImage || !req.files.coverImage.length > 0) {
        throw new ApiError(400, "Cover image file is required")
    }

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is required")
    }

    // Delete old cover image from cloudinary (optional but recommended)
    const user = await User.findById(req.user._id);
    if (user.coverImage) {
        // Extract public_id from the old cover image URL
        const oldCoverImagePublicId = user.coverImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldCoverImagePublicId);
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage) {
        throw new ApiError(400, "Error while uploading cover image")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Cover image updated successfully"))
});

const handleUserDetailsUpdate = asyncHandler(async (req, res) => {
    const { fullName, city } = req.body;

    if (!fullName && !city) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const updateFields = {}
    if (fullName) updateFields.fullName = fullName.toLowerCase()
    if (city) updateFields.city = city.toLowerCase()

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateFields
        },
        { new: true }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details updated successfully"))
});

const handlePasswordChange = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user._id);

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password doesn't match.")
    }

    // Verify old password
    const isPasswordValid = await user.checkPassword(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password")
    }

    // Set new password
    user.password = newPassword
    await user.save() // This will trigger the pre-save hook to hash the password

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password changed successfully"
        ))
})

const handleDeleteUser = asyncHandler(async (req, res) => {
    // Delete user from database
    const deleteUser = await User.findByIdAndDelete(req.user._id);
    // how to get public_id ?
    // const deleteAvatar = await deleteFromCloudinary(deleteUser.avatar);

    if (!deleteUser) {
        throw new ApiError(404, "User not found")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
    }

    // Clear authentication cookies
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User account deleted successfully"))
})

const checkPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;

    if(!password){
        throw new ApiError(400, "Please enter your password")
    }

    const getUser = await User.findById(req.user._id);

    if(!getUser){
        throw new ApiError(500, "Something went wrong while fetching the user details.")
    }
    const isPasswordCorrect = await bcrypt.compare(password, getUser.password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Incorrect password")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Entered password is correct")
    )
})

module.exports = {
    handleUserSignup, handleUserLogin, handleUserLogout,
    handleAvatarChange, handleCoverImgChange, handleUserDetailsUpdate,
    handlePasswordChange, handleDeleteUser, checkPassword
}