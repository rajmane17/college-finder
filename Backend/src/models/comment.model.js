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
            ref: "College"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment