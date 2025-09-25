const User= require("../models/users");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

module.exports.renderSignupForm=(req,res)=>{
    // res.send("signup");
    res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        console.log(req.body);

        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "New user registered");
            return res.redirect("/listings");  // ✅ always return after redirect
        });
    } catch (err) {
        next(err);
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login=async(req,res)=>{
    // we use async as we are making changes in the database.
    // first when we enter the details it will first authenticate the username and password
    // and then go to login page, if this gives error then response cant be send.
    req.flash("success","You are logged into wonderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings"; 
    // ||^^|| this line mean that , if we directly login the page , then the isauthenticated function
    // wont execute, if it dont execute then there is no redirectUrl (or) original url, so it gives undefined.
    // so if it is undefined, then we are redirecting to listings page.

    console.log(redirectUrl);
    res.redirect(redirectUrl);
    // req.session.redirectUrl redirects to the requested url i.e login page or edi tpage.
    // redirect("/listings");
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        // here, in logout time any error occured will go to next(err), then error handler will handle it.
        req.flash("success","You are logged out !!");
        res.redirect("/listings");
    });
};

