const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js")
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js")

const {handleAddCollege, getCollege, getCollegesAccordingToCity, getAnalytics} = require("../controllers/college.controllers.js")

//fetch a particular college
router.get("/:collegeId", verifyJWT, getCollege)

// fetching all the colleges according to the city
router.get("/city/:city", verifyJWT, getCollegesAccordingToCity)

// adding a new college
router.post("/", verifyJWT, isReviewer, upload.single("collegeImg"), handleAddCollege);

// how many people have clicked on a college will be shown
router.get("/analytics/:collegeId", verifyJWT, getAnalytics)


module.exports = router