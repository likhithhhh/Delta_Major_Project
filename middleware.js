const Listing=require("./models/listings.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){     // if the requested user is not loggedin
        // this isauthenticated function is from passport, it generally checks that the 
        // user who is manipulating the website is logged in or not.
        // redirecturl save
        req.session.redirectUrl=req.originalUrl;
        // this originalurl will give the absolute url for we request.
        // we are saving it as a property in req.session object. 
        // if we go to new listing page, it asks login, after login it goes to listings, 
        // for redirecting to same page we are using original url.
        req.flash("error","you must be logged in first!!");
        res.redirect("/users/login");
        // so when we log in , we have the redirecturl, so it goes to the same page where the login route exists.

    }else{
        next();
    }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){  //if session exists
        res.locals.redirectUrl=req.session.redirectUrl;  // when we save in res.locals
        // it will be saved permanently.
    }
    next();
    // so , if when the user is logged in then the req.session.redirecturl will be resetted.
    // so we have to save that in the locals variable.
};


module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
        // if we dont write return function then the next functions will be executed i.e find and update.
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listings/${id}`);
        // if we dont write return function then the next functions will be executed i.e find and update.
    }
    next();
}; 