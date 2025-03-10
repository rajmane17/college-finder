const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js")
const { verifyJWT } = require("../middlewares/auth.middleware.js")

//controller imports
const { 
    handleUserSignup,
    handleUserLogin, 
    handleUserLogout, 
    checkPassword, 
    verifyOTP,
    handleAvatarChange, 
    handleCoverImgChange, 
    handleUserDetailsUpdate,
    handlePasswordChange, 
    handleDeleteUser 
} = require("../controllers/user.controllers");

// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log('Request files:', req.files);
  console.log('Request body:', req.body);
  next();
};

router.post("/initiate-signup",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    handleUserSignup);

router.post("/login", handleUserLogin);

router.post('/verify-otp', verifyOTP);

router.get("/logout", verifyJWT, handleUserLogout);

router.patch("/update-avatar",
    verifyJWT,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    handleAvatarChange
);

router.patch("/update-coverimage",
    verifyJWT,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    handleCoverImgChange
);

router.patch("/update-details",
    verifyJWT,
    handleUserDetailsUpdate
);

router.patch("/change-password",
    verifyJWT,
    handlePasswordChange
);

router.delete("/delete-user", verifyJWT, handleDeleteUser);

router.post("/check-password", verifyJWT, checkPassword);

module.exports = router