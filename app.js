if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
    // we should not share the credentials in the production phase i.e deploying the file.
    // in the time of deployment, we'll write the phase as "production , then these"
    // environmentak credentials will not be seen.
}
// console.log(process.env);

const MongoDbAtlas_URL=process.env.MONGODBATLAS_URL;
const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); 
const ExpressError=require("./utils/expressError.js");
// requiring the review model for the reviews.
const flash=require("connect-flash");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/users.js");

const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const users=require("./routes/users.js")

app.engine("ejs",ejsMate);
const mongoose = require('mongoose');


const store=MongoStore.create({
    mongoUrl:MongoDbAtlas_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

// store.on("error",()=>{
//     console.log("Error in Mongo Session store",err);
// });

let sessionOptions=
    {
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires: Date.now() + 7*24*60*60*1000,
            maxAge: 7*24*60*60*1000,
            httpOnly: true
            // here we are setting a fixed time for the cookie or session id
            // after this 1 week of time , the cookie will expire.
        }
    };


main().then(()=>{
    console.log("connection successful for mongodb and node");
}).catch((err)=> {
    console.log(err)
});


async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
    await mongoose.connect(MongoDbAtlas_URL);

}


app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));

app.listen(port,(req,res)=>{
    console.log(`app is listening to ${port}`);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));``
app.use(express.urlencoded({extended:true}));

app.use("/",listings);

app.use(session(sessionOptions));
// session is always initialised whenever a request occurs.
app.use(flash());
// always we should write the flash and session functions before the routers.

// For Authentication by Passport
// and we always write the passport below the session options because , whenever a session 
// is running we should login once and the user if goes to another page, the login should 
// be saved.

app.use(passport.initialize());
// passport is always initialised whenever a request occurs.
app.use(passport.session()); 
//  |^| the session should be same if the user browses from page to page.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  // to serialise users, i.e to store the
// user information in session when using the session. 
passport.deserializeUser(User.deserializeUser());  // to deserialise users, i.e to remove the
// user information in session when quitting website

// creating and registering a fakeuser
 
// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"delta@gmail.com",
//         username:"delta"
//         // even if we doesnot write the username in the schema, we can write here.
//     });

//     let registeredUser=await User.register(fakeuser,"helloworld");
        // we can use save() function, but here, we are using authentication, so we use 
        // register() function with passowrd, it will directly save into the datbase.
//     res.send(registeredUser);
// });


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // res.locals is an object in Express.js that lets you store data and make it
    // available to the templates (views) rendered by the app.
    // It is useful for passing data from middleware to the views or to the next route handler.
    // we have created a middleware for the res.locals to use these values in the index.ejs or edit.ejs etc..
    next();
});

app.use("/listings",listings); 
// this line is an express router where we had restructured the listings from app.js to listings.js
// we are creating a express.router and creating an object "router" for it like "app".
// as the listings is written here, we can directly write the path after listings
// for example: /listings --> "/" and /listings/:id --> "/:id" 
app.use("/listings/:id/reviews",reviews);
// same process for the reviews.js
//  NOTE: here , whenever we try to add a review, it cannot take the id , because the id parameter 
//  we'll stay in the app.js file only, to move from app.js to reviews we use "merge params" option. 
// the di will be undefined if we dont use merge.aprams
app.use("/users",users);
// for users routes file

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});  

// |^| this all function occur when no route occur from existing routes, apart from all the routes , for new other routes it will give this error..

// Using  error handler
// app.use((err,req,res,next)=>{
//     res.send("Something went wrong!! please check it..");
// });


// Using express error

app.use((err,req,res,next)=>{
    // let {status,message}=err;
    // res.status(status).send(message);
    // console.log(message);
    res.render("error.ejs",{err});
});
