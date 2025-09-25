const express=require("express");
const router=express.Router({mergeParams:true});
// here , MERGEPARAMS is used to merge the parameters from app.js to review.js.
// i.e /listings/:id/reviews path, we have id parameter, which doesnot passes to review.js
// file and hence it gives the id undefined in the post route of reviews.
// it dont know in which listing id , i should create a revoew.
const Review=require("../models/reviews.js");
const Listing=require("../models/listings.js");
// here we should add the listing model too , beacuse first the listing id is found and then 
// the reviews of the listing will be created.
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {reviewSchema}=require("../schema.js");
const {isLoggedin,isReviewAuthor}= require("../middleware.js");

const reviewController= require("../controllers/reviews.js");

// validating schema by middleware
const validateReview= function(req,res,next){
    // here we are declaring error, but is it receives the error??
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        console.log(error);
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
    
};

// POST REVIEW route

router.post("/",isLoggedin, validateReview, wrapAsync(reviewController.createReview));

// Delete review route

router.delete("/:reviewid",isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;  