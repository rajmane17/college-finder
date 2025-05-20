const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    // konse comment ko like kiya hai
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true // At least comment should be required
    },
    // kisne like kiya hai
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Add compound index to prevent duplicate likes
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

module.exports = Like