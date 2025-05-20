const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
)

commentSchema.index({ collegeId: 1 });
commentSchema.index({ owner: 1 });

commentSchema.plugin(mongooseAggregatePaginate)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment