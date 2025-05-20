const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    collegeImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // additionalImages:{
    //     type: String
    // },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
        index: true
    },
    programs: {
        type: [String],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, { timestamps: true })

const College = mongoose.model("College", collegeSchema);

module.exports = College