const express = require("express");
const router = express.Router();
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js");

const {
    toggleCommentLike,
    getCommentLikes,
    getLikedCommentsByUser,
    checkIfUserLikedComment
} = require("../controllers/like.controllers.js");

//Implementing this will be a bit difficult...

// Get all likes for a comment
router.get("/get-likes/:commentId", verifyJWT, isReviewer, getCommentLikes);

// Toggle like on a comment
router.get("/toggle/:commentId", verifyJWT, isReviewer, toggleCommentLike);

// Check if user has liked a comment
router.get("/check/:commentId", verifyJWT, isReviewer, checkIfUserLikedComment);

// Get all comments liked by the logged in user
router.get("/user/comments", verifyJWT, isReviewer, getLikedCommentsByUser);

// Get all comments for a specific college
router.get("/user/comments/:collegeId");

module.exports = router;