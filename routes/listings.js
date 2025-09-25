const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedin,isOwner}=require("../middleware.js");
// here we are using two dots because to direct to the path, as the path is different from the app.js and listings.js

const listingController=require("../controllers/listings.js");

const multer  = require('multer');  //used for uploading files.
const {storage}=require("../cloudConfig.js");  // we are using storage from the cloudConfig.js i.e to store the
// files in that cloudinary storage.
const upload = multer({ storage });  // here multer directly stores the files in the uploads folder defaultly,
// but now we gave storage to stoer the files. ||^^||
// this package is used to send the files from front end to backend.
// so when we uplaod a file , the file will bw stored in cloudinary website folder.

// validating schema by middleware
const validateListing= function(req,res,next){
    let {error}=listingSchema.validate(req.body);
    // here, actually the joi object will validates the schema , it is the object where 
    // it returns the value and error. we can initiate the result here, and we can extract
    // result.error from that.

    // but here, we use destructuring {error} from the joi object and directly printed error.

    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        // |^| it checks all the elements in the array and returns the actual error
        // console.log(error);
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
        // we are using the function as the middleware, so for forwarding we use next()
    } 
    
};

// Using Router.route for combining the routes.

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single("listing[image]") , validateListing, wrapAsync(listingController.createListing));


//NEW ROUTE 

router.get("/new", isLoggedin, listingController.renderNewForm);
// here, isloggedin is passes as an middleware where it contains req.isAuthenticated function.
// this isauthenticated function is from passport, it generally checks that the 
// user who is manipulating the website is logged in or not.



router.route("/:id")
.put(isLoggedin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedin,isOwner, wrapAsync(listingController.destroyListing));

//EDIT ROUTE.
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;


// OLD ROUTES , BEFORE USING Router.route

//INDEX ROUTE
// router.get("/", wrapAsync(listingController.index));

//CREATE ROUTE
// router.post("/", validateListing, wrapAsync(listingController.createListing));

//UPDATE ROUTE
// router.put("/:id",validateListing, wrapAsync(listingController.updateListing));

//SHOW ROUTE
// router.get("/:id", wrapAsync(listingController.showListing));

//DELETE ROUTE
// router.delete("/:id", isOwner,wrapAsync(listingController.destroyListing));



