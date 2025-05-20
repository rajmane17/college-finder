const College = require("../models/college.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const mongoose = require("mongoose");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

// Add a new college ==> DONE
const handleAddCollege = asyncHandler(async (req, res) => {
    const { name, description, location, city, programs } = req.body;
    // console.log( name, description, location, city, programs);

    if (
        [name, description, location, city].some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "Required fields cannot be empty");
    }

    const existingCollege = await College.findOne({ 
        // we will find if there is a pre-existing college with same name and city
        name: { $regex: new RegExp(`^${name}$`, 'i') }, 
        city: { $regex: new RegExp(`^${city}$`, 'i') } 
    });

    if (existingCollege) {
        throw new ApiError(409, "A college with this name already exists in this city");
    }

    let collegeImageUrl = "";
    // let additionalImagesUrls = [];

    if (req.files && req.files.collegeImage && req.files.collegeImage.length > 0) {
        // console.log("FILE: ",req.files);
        const collegeImageLocalPath = req.files.collegeImage[0].path;
        const uploadedImage = await uploadOnCloudinary(collegeImageLocalPath);
        
        if (!uploadedImage) {
            throw new ApiError(500, "Error uploading college image");
        }
        
        collegeImageUrl = uploadedImage.url;
    }

    // Upload additional images if provided
    // if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
    //     const uploadPromises = req.files.additionalImages.map(async (file) => {
    //         const uploadedImage = await uploadOnCloudinary(file.path);
    //         return uploadedImage ? uploadedImage.url : null;
    //     });

    //     additionalImagesUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
    // }

    // Parse programs as arrays if they're provided as strings
    let parsedPrograms = programs;

    if (programs && typeof programs === 'string') {
        try {
            parsedPrograms = JSON.parse(programs);
        } catch (error) {
            parsedPrograms = programs.split(',').map(item => item.trim());
        }
    }

    const college = await College.create({
        name,
        description,
        location,
        city: city.toLowerCase(),
        collegeImage: collegeImageUrl,
        programs: parsedPrograms || [],
        createdBy: req.user._id
    });

    if (!college) {
        //if the college is not created successfully, we need to delete the uploaded image from cloudinary
        const cloudinaryPublicId = collegeImageUrl.split('/').pop().split('.')[0];
        await deleteFromCloudinary(cloudinaryPublicId);
        throw new ApiError(500, "Failed to create college");
    }

    return res.status(201).json(
        new ApiResponse(201, college, "College added successfully")
    );
});

// Updating the college details ==> DONE
// I need to make some upgradations in this function. the one who have added the college can only update the college
// I will do this by checking the addedBy field of the college and the user who is updating the college
const updateCollege = asyncHandler(async (req, res) => {

    const {collegeId} = req.params;
    const {name, description, programs} = req.body;

    if(!collegeId){
        throw new ApiError(400, "College ID is required");
    }

    //checking if the provided college id is valid or not ==> Just to not waste our api call to the database
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
        throw new ApiError(400, "Invalid college ID");
    }

    const college = await College.findById(collegeId);

    if(!college){
        throw new ApiError(404, "College not found");
    }

    if(college.addedBy.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this college");
    }

    if(!name || !description || !programs){
        throw new ApiError(400, "Required fields cannot be empty");
    }

    //parsing programs as arrays if they are provided as strings
        if (programs) {
        if (typeof programs === 'string') {
            try {
                parsedPrograms = JSON.parse(programs);
            } catch (error) {
                parsedPrograms = programs.split(',').map(item => item.trim());
            }
        } else {
            parsedPrograms = programs;
        }
    }

    if(req.files &&req.files.collegeImage && req.files.collegeImage.length > 0){
        //provides us the local path where the image is stored
        const collegeImageLocalPath = req.files.collegeImage[0].path;

        if(!collegeImageLocalPath){
            throw new ApiError(500, "Error uploading college image");
        }

        //deleting the old image from cloudinary
        if (college.collegeImage) {
            const oldImagePublicId = college.collegeImage.split('/').pop().split('.')[0];
            await deleteFromCloudinary(oldImagePublicId);
        }

        //uploading the new image
        const uploadedImage = await uploadOnCloudinary(collegeImageLocalPath);

        if(!uploadedImage){
            throw new ApiError(500, "Error uploading college image");
        }
        
    }

    const updateDetails = {
        name,
        description,
        programs: parsedPrograms,
        collegeImage: uploadedImage.url
    }

    // $set is not mandotory but it is a good practice to use it as it just updates the fields which are provided
    const updatedCollegeDetails = await College.findByIdAndUpdate(collegeId, {$set: updateDetails}, {new: true});

    if(!updateDetails){
        const cloudinaryPublicId = uploadedImage.url.split('/').pop().split('.')[0];
        await deleteFromCloudinary(cloudinaryPublicId);
        throw new ApiError(500, "Failed to update college");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedCollegeDetails, "College updated successfully")
    )
    
//     // Handle additional images if present
//     if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
//         // Delete old additional images from cloudinary
//         if (college.additionalImages && college.additionalImages.length > 0) {
//             for (const imageUrl of college.additionalImages) {
//                 const publicId = imageUrl.split('/').pop().split('.')[0];
//                 await deleteFromCloudinary(publicId);
//             }
//         }
        
//         // Upload new additional images
//         const uploadPromises = req.files.additionalImages.map(async (file) => {
//             const uploadedImage = await uploadOnCloudinary(file.path);
//             return uploadedImage ? uploadedImage.url : null;
//         });
        
//         const additionalImagesUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
//         updateFields.additionalImages = additionalImagesUrls;
//     }

});

//deleting the college ==> DONE
//A college can be deleted only by  the user who has created it
const deleteCollege = asyncHandler(async (req, res) => {
    
    const { collegeId } = req.params;
    
    if (!collegeId) {
        throw new ApiError(400, "College ID is required");
    }
    
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
        throw new ApiError(400, "Invalid college ID");
    }
    
    // Find the college to delete
    const college = await College.findById(collegeId);
    
    if (!college) {
        throw new ApiError(404, "College not found");
    }

    if(college.addedBy.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this college");
    }
    
    // Delete college images from cloudinary
    if (college.collegeImage) {
        const imagePublicId = college.collegeImage.split('/').pop().split('.')[0];
        await deleteFromCloudinary(imagePublicId);
    }
    
    // Delete the college
    await College.findByIdAndDelete(collegeId);
    
    // Note: In a production application, you would typically delete related data
    // such as comments, likes, etc., or implement soft deletion
    
    return res.status(200).json(
        new ApiResponse(200, {}, "College deleted successfully")
    );
});

//Get the colleges of a specific city ==> DONE
const getCollegesAccordingToCity = asyncHandler(async (req, res) => {
    const { city } = req.params;
    
    if (!city) {
        throw new ApiError(400, "City is required");
    }
    
    //Important
    const query = { city: { $regex: new RegExp(`^${city}$`, 'i') } };
    
    const colleges = await College.find(query)

    if(!colleges){
        return res.status(404).json(
            new ApiResponse(404, {}, "No college of this city are present")
        )
    }
    
    //Remember this function which we get from mongoDb
    const totalColleges = await College.countDocuments(query);
    
    return res.status(200).json(
        new ApiResponse(200, { colleges, totalColleges }, `Colleges in ${city} retrieved successfully`)
    );
});

// Get a specific college by ID ==> DONE
const getCollege = asyncHandler(async (req, res) => {

    const {collegeId} = req.params;

    if(!collegeId){
        throw new ApiError(400, "College ID is required");
    }

    // returns us a boolean value
    if(!mongoose.Types.ObjectId.isValid(collegeId)){
        throw new ApiError(400, "Invalid college ID");
    }

    const college = await College.findById(collegeId);

    if(!college){
        throw new ApiError(404, "College not found");
    }

    return res.status(200).json(
        new ApiResponse(200, college, "College retrieved successfully")
    )
});

//=====================================*=========================*======================*======================================
// FOR NOW ONLY THE ABOVE FUNCTIONS ARE IMPLEMENTED
//=====================================*=========================*======================*====================================== 

// Get all colleges with pagination 
const getAllColleges = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const colleges = await College.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name city collegeImage ratings views')
        .exec();
    
    const totalColleges = await College.countDocuments();
    
    const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalColleges / limit),
        totalItems: totalColleges,
        hasNextPage: page < Math.ceil(totalColleges / limit),
        hasPrevPage: page > 1
    };
    
    return res.status(200).json(
        new ApiResponse(200, { colleges, pagination }, "Colleges retrieved successfully")
    );
});

// Search colleges by name or other criteria 
const searchColleges = asyncHandler(async (req, res) => {
    const { q, city, program } = req.query;
    
    // Build query object
    const query = {};
    
    if (q) {
        query.name = { $regex: q, $options: 'i' };
    }
    
    if (city) {
        query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }
    
    if (program) {
        query.programs = { $elemMatch: { $regex: program, $options: 'i' } };
    }
    
    const colleges = await College.find(query)
    
    const totalColleges = await College.countDocuments(query);
    
    return res.status(200).json(
        new ApiResponse(200, { colleges, pagination }, "Search results retrieved successfully")
    );
});

//get top rated college
// const getTopRatedColleges = asyncHandler(async (req, res) => {
//     const limit = parseInt(req.query.limit) || 5;
    
//     const colleges = await College.find({ "ratings.totalReviews": { $gt: 0 } })
//         .sort({ "ratings.overall": -1 })
//         .limit(limit)
//         .select('name city collegeImage ratings views')
//         .exec();
    
//     return res.status(200).json(
//         new ApiResponse(200, colleges, "Top rated colleges retrieved successfully")
//     );
// });

// Get analytics for a college
const getAnalytics = asyncHandler(async (req, res) => {
    const { collegeId } = req.params;
    
    if (!collegeId) {
        throw new ApiError(400, "College ID is required");
    }
    
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
        throw new ApiError(400, "Invalid college ID");
    }
    
    const college = await College.findById(collegeId);
    
    if (!college) {
        throw new ApiError(404, "College not found");
    }
    
    // Gather additional analytics data
    // For example, count of comments, likes, etc.
    
    // Using the Comment model which we saw in other controllers
    const Comment = require("../models/comment.model");
    const commentsCount = await Comment.countDocuments({ collegeId });
    
    // Get ratings distribution
    const analytics = {
        views: college.views || 0,
        commentsCount,
        ratings: college.ratings || {
            overall: 0,
            academics: 0,
            infrastructure: 0,
            placement: 0,
            valueForMoney: 0,
            totalReviews: 0
        }
    };
    
    return res.status(200).json(
        new ApiResponse(200, analytics, "College analytics retrieved successfully")
    );
});

module.exports = {
    handleAddCollege,
    getCollege,
    getAllColleges,
    getCollegesAccordingToCity,
    searchColleges,
    // getTopRatedColleges,
    updateCollege,
    deleteCollege,
    getAnalytics
};