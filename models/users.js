const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

let userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
    // here, we only write the email, because the passport local mongoose will directly add the 
    // username and passowrd with the hashong and salting..
});

userSchema.plugin(passportLocalMongoose);
let User=mongoose.model("User",userSchema);

module.exports=User;