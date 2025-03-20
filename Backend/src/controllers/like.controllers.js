const Like = require("../models/like.model");
const Comment = require("../models/comment.model");
const {asyncHandler} = require("../utils/asyncHandler");
const {ApiError} = require("../utils/apiError");
const {ApiResponse} = require("../utils/apiResponse");
const mongoose = require("mongoose");

// Toggle like on a comment (like if not liked, unlike if already liked)
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format");
    }
    
    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    
    // Check if user has already liked this comment
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });
    
    if (existingLike) {
        // User already liked this comment, so unlike it
        await Like.findByIdAndDelete(existingLike._id);
        
        return res.status(200).json(
            new ApiResponse(200, {liked: false}, "Comment unliked successfully")
        );
    } else {
        // User hasn't liked this comment yet, so like it
        const newLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        });
        
        return res.status(200).json(
            new ApiResponse(200, {liked: true, like: newLike}, "Comment liked successfully")
        );
    }
});

// Get all likes for a specific comment
const getCommentLikes = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format");
    }
    
    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    
    // Fetch all likes for this comment with user information
    const likes = await Like.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedBy",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likedBy: { $first: "$likedBy" }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
    console.log("likes: ",likes);
    
    return res.status(200).json(
        new ApiResponse(200, {likes, count: likes.length}, "Comment likes retrieved successfully")
    );
});

/**
 * Get all comments liked by the current user
 */
const getLikedCommentsByUser = asyncHandler(async (req, res) => {
    // Get pagination parameters or use defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Find all comments liked by the user
    const likedCommentsAggregate = Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "comment",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                comment: { $first: "$comment" }
            }
        },
        {
            $lookup: {
                from: "colleges",
                localField: "comment.collegeId",
                foreignField: "_id",
                as: "college",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            location: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                college: { $first: "$college" }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
    
    // Use mongoose-aggregate-paginate to handle pagination
    const likedComments = await Like.aggregatePaginate(
        likedCommentsAggregate,
        { page, limit }
    );
    
    return res.status(200).json(
        new ApiResponse(200, likedComments, "Liked comments retrieved successfully")
    );
});

/**
 * Check if the current user has liked a specific comment
 */
const checkIfUserLikedComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format");
    }
    
    const like = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });
    
    return res.status(200).json(
        new ApiResponse(200, {
            isLiked: !!like,
            likeId: like ? like._id : null
        }, "Like status retrieved successfully")
    );
});

module.exports = {
    toggleCommentLike,
    getCommentLikes,
    getLikedCommentsByUser,
    checkIfUserLikedComment
};