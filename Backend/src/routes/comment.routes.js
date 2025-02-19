const express = require("express");
const app = express();

const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js")
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js")

const {
    createComment,
    getCollegeComments,
    updateComment,
    deleteComment
} = require("../controllers/comment.controller.js");

// Comment routes
router.route("/")
    .post(verifyJWT, upload.none(), createComment)

router.route("/:commentId")
    .patch(verifyJWT, upload.none(), updateComment)
    .delete(verifyJWT, deleteComment);

router.route("/:collegeId")
    .get(verifyJWT, getCollegeComments)

module.exports = router