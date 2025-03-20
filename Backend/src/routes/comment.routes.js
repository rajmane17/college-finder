const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js")
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js")

const {
    createComment,
    getCollegeComments,
    updateComment,
    deleteComment
} = require("../controllers/comment.controllers.js");

// Comment routes
router.route("/:collegeId")
    .post(verifyJWT, isReviewer, upload.none(), createComment)

router.route("/:commentId")
    .patch(verifyJWT, upload.none(), updateComment)
    .delete(verifyJWT, deleteComment);

router.route("/college/:collegeId")
    .get(verifyJWT, getCollegeComments)

module.exports = router