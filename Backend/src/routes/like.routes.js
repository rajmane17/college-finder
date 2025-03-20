const express = require("express");
const router = express.Router();
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js");

const {
    toggleCommentLike,
    getCommentLikes,
    getLikedCommentsByUser,
    checkIfUserLikedComment
} = require("../controllers/like.controllers.js");

// Get all likes for a comment
router.get("/comment/:commentId", verifyJWT, isReviewer, getCommentLikes); // ==> 1

// Toggle like on a comment
router.post("/toggle/comment/:commentId", verifyJWT, isReviewer, toggleCommentLike); // ==> 2

//=========================*====================*======================*==========================================
// THE BELEOW ROUTES ARE A BIT COMPLEX SO INITIALLY, EXECUTE THE ABOVE ROUTES AND THEN MOVE TO BELOW ROUTES
//=========================*====================*======================*==========================================

// Check if user has liked a comment
router.get("/check/comment/:commentId", verifyJWT, isReviewer, checkIfUserLikedComment);

// Get all comments liked by the current user
router.get("/user/comments", verifyJWT, isReviewer, getLikedCommentsByUser);

module.exports = router;