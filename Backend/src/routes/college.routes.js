const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js");
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js");

const { 
    handleAddCollege, 
    getCollege, 
    getCollegesAccordingToCity, 
    getAnalytics, 
    getAllColleges,
    updateCollege,
    deleteCollege,
    searchColleges,
} = require("../controllers/college.controllers.js");

// Get all colleges with pagination
router.get("/", verifyJWT, getAllColleges);

// Get top rated colleges
// router.get("/top-rated", verifyJWT, getTopRatedColleges);

// Search colleges by name or other criteria
router.get("/search", verifyJWT, searchColleges);

// Get analytics for a college
router.get("/analytics/:collegeId", verifyJWT, getAnalytics);

//===================================*=====================================*=====================================
// For now, we will only implement the following routes:
// 1. Add a new college 
// 2. Update a college
// 3. Delete a college
// 4. Fetch colleges according to city
// 5. Get a specific college by ID
//===================================*=====================================*=====================================

// Add a new college
router.post(
    "/", 
    verifyJWT, // checks if the user is logged in or not
    isReviewer, // checks if the user is a reviewer
    upload.fields([
        {
            name: "collegeImage",
            maxCount: 1
        },
        // {
        //     name: "additionalImages",
        //     maxCount: 5
        // }
    ]), 
    handleAddCollege
);  

// Update a college 
router.patch(
    "/:collegeId",
    verifyJWT,
    isReviewer,
    upload.fields([
        {
            name: "collegeImage",
            maxCount: 1
        }
    ]),
    updateCollege
);

// Delete a college 
router.delete("/:collegeId", verifyJWT, isReviewer, deleteCollege);

// Fetch colleges according to city
router.get("/city/:city", verifyJWT, getCollegesAccordingToCity);

// Get a specific college by ID
router.get("/:collegeId", verifyJWT, getCollege);

module.exports = router;