const Listing=require("../models/listings");
const mapToken=process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find();
    res.render("./listings/index.ejs",{allListings,currUser:req.user});
};

module.exports.renderNewForm=(req,res)=>{
    let saveUrl= req.originalUrl;
    req.session.savedurl=saveUrl;  // this will create savedurl property in session object.
    console.log(req.session);  //prints the user information who is using
    res.render("./listings/new.ejs");
};

module.exports.createListing=async(req,res,next)=>{
    // using wrapasync function for create route..

    // let {title,description,price,location,country}=req.body;
    // let NEWListing=new Listing({title:title,
    //                             description:description,
    //                             price:price,
    //                             location:location,
    //                             country:country});

    // we can also write like this when we take listing as a key in the object..
    // ex: listing[title],listing[description]..   
    // if(!req.body.listing){
    //     throw new ExpressError(400,"sendvalid data for listing");
    // }
    // if listing is not there..

    // This is by using joi validation object.
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    
    console.log("Location entered by user:", req.body.listing.location);

    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })  
    .send(); 
    console.log("Geocoding Response:", response.body.features);
            
    let url=req.file.path;
    let filename=req.file.filename;
    // ||^^|| the path and filename are the properties of req.file object where it created
    // when we uplaod a file. we are adding the url and filename in the listing object when 
    // creating  anew listing.
    let newListing=new Listing(req.body.listing);
        
    newListing.owner=req.user._id;  // pushing the current user id from the user object
    // here we write req.user.id because intially when creating listing , we dont have a
    // owner, so when creating from body we get user id and passing to owner.
    newListing.image={url,filename};
if (response.body.features.length) {
    newListing.geometry = response.body.features[0].geometry;
} else {
    newListing.geometry = { type: "Point", coordinates: [0, 0] }; // fallback
}    // here, we have to write features[0] because it is in array form.
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing created successfully");
    res.redirect("/listings");    

    // here, if any error like writing string in place of price, as it is number type, gives error.
    // error goes to error handler.
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    // console.log(listing)
    if(!listing){
        req.flash("error","Listing you requested doesnot exist!");
        return res.redirect("/listings");
        // if the lisitng was deleted, but we copy the url of listing and accessing it, 
        // then the error flash will be shown.
    }
    res.render("./listings/edit.ejs",{listing});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){  // if the cuurent user is not 
    //     // equal to the lisying owner , then it gives flash error.
    //     req.flash("error","You are not the owner of this listing");
    //     return res.redirect(`/listings/${id}`);
    //     // if we dont write return function then the next functions will be executed i.e find and update.
    // }

    // ||^^|| we write this in middleware.js as isOwner

    let updatelisting=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // ... is used when to retrive the values as key and values when they are in an object..
    
    if(typeof req.file !== "undefined"){  //if the file is existed , then it is true
    let url=req.file.path;
    let filename=req.file.filename;
    updatelisting.image={url,filename};
    await updatelisting.save();
    }
    console.log(listing);
    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // this populate function is used for showing/expanding/populating the full info
    // of the reviews and authors. normally , if not used it shows the object ids only.
    // so whenever, we see the listing , in the output, it shows all the details.
    if(!listing){
        req.flash("error","Listing you requested doesnot exist!");
        return res.redirect("/listings");
        // if the lisitng was deleted, but we copy the url of listing and accessing it, 
        // then the error flash will be shown.
    }
    console.log(listing);

    res.render("./listings/show.ejs",{listing,mapToken:process.env.MAP_TOKEN}); 
};

module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing); 
    req.flash("success","Listing deleted successfully");   
    res.redirect("/listings");
};