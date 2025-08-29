const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const reviewController = require("../controllers/review.js");

//reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//  reviews delete route  
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));
module.exports= router;

 