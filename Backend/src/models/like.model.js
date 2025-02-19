const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    // konse comment ko like kiya hai
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    // kisne like kiya hai
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

const Like = mongoose.model("Like", likeSchema);

module.exports = Like