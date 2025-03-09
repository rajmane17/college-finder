const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    collegeImage: {
        type: String,
    },
    collegeInfo: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }

}, {timestamps: true})

const College = mongoose.model("College", collegeSchema);

module.exports = College