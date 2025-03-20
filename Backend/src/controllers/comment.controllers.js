const Comment = require("../models/comment.model");
const {asyncHandler} = require("../utils/asyncHandler");
const {ApiError} = require("../utils/apiError");
const {ApiResponse} = require("../utils/apiResponse");
const mongoose = require("mongoose");

const createComment = asyncHandler(async(req, res) => {
    const {content} = req.body;
    const {collegeId} = req.params;

    if(!content){
        throw new ApiError(400, "Please enter the content")
    }

    if(!collegeId){
        throw new ApiError(400, "College ID is required")
    }

    // Validate if collegeId is a valid ObjectId
    if(!mongoose.Types.ObjectId.isValid(collegeId)){
        throw new ApiError(400, "Invalid college ID")
    }

    const comment = await Comment.create({
        content,
        collegeId,
        owner: req.user._id,
    })

    if(!comment){
        throw new ApiError(500, "Failed to create comment")
    }

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment created successfully")
    )

    
})

//The person who created the comment can delete it
const deleteComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(400, "Comment ID is required")
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment ID")
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    // Check if the user is the owner of the comment
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})

// The person who created the comment can update it
const updateComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    if(!commentId){
        throw new ApiError(400, "comment id is required");
    }

    // Validate if collegeId is a valid ObjectId
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid Comment ID")
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    // Checking if the user is the owner of the comment
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {$set: {content}},
        {
            new: true // return us updated comment
        }
    )

    if(!updatedComment){
        throw new ApiError(500, "Couldn't update the comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updateComment, "comment updated successfully")
    )
})

// To under this controller you need to understand aggregates
// important
const getCollegeComments = asyncHandler(async(req, res) => {
    const {collegeId} = req.params;

    if(!collegeId){
        throw new ApiError(400, "College ID is required")
    }

    if(!mongoose.Types.ObjectId.isValid(collegeId)){
        throw new ApiError(400, "Invalid college ID")
    }

    const commentAggregate = Comment.aggregate([
        //stage 1
        {
            //Filters the comments to include only those that belong to a specific collegeId
            $match: {
                collegeId: new mongoose.Types.ObjectId(collegeId)
            }
        },
        //stage 2
        {
            //Performs a left join with the users collection
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
        //stage 3
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        //stage 4
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    const comments = await Comment.aggregatePaginate(
        commentAggregate,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        }
    );

    if(!comments || comments.docs.length === 0){
        return res.status(200).json(
            new ApiResponse(200, [], "No comments found for this college")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments retrieved successfully")
    )
})

module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getCollegeComments
}