const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js");
const { verifyJWT, isReviewer } = require("../middlewares/auth.middleware.js");

const { 
    handleAddCollege, 
    getCollege, 
    getCollegesAccordingToCity, 
    getAllColleges,
    updateCollege,
    deleteCollege,
    searchColleges,
} = require("../controllers/college.controllers.js");

router.post(
    "/add-college", 
    verifyJWT, 
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
    // upload.fields([
    //     {
    //         name: "collegeImage",
    //         maxCount: 1
    //     }
    // ]),
    updateCollege
);

router.delete("/:collegeId", verifyJWT, isReviewer, deleteCollege);

router.get("/city/:city", verifyJWT, getCollegesAccordingToCity);

router.get("/:collegeId", verifyJWT, getCollege);

// handle pagination in FE
router.get("/", verifyJWT, getAllColleges);

router.get("/search", verifyJWT, searchColleges);

module.exports = router;