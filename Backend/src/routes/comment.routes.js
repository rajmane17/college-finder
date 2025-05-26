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
router.route("/create-comment/:collegeId")
    .post(verifyJWT, isReviewer, upload.none(), createComment)

router.route("/:collegeId")
    .get(verifyJWT, getCollegeComments)

router.route("/:commentId")
    .patch(verifyJWT, upload.none(), updateComment)
    .delete(verifyJWT, deleteComment);

module.exports = router