const Listing= require("../models/listings.js");
const Review= require("../models/reviews.js");


module.exports.createReview=async(req,res)=>{
    console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;  // before saving the new review, we are saving the user to the review.
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log(newreview);
    req.flash("success","New review created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    // pull operator is used when we want to delete a review from the listing, then the review
    // is deleted from the review collectiion, but it will not deleted from the listing.reviews
    // array, so the pull operator will reach to the given review id and deltes it from the listing.
    await Review.findByIdAndDelete(reviewid);
    console.log(reviewid);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`); 
};  