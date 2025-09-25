const mongoose= require("mongoose");

const reviewSchema=new mongoose.Schema(
    {
        comment:String,
        rating:{
            type:Number,
            min:1,
            max:5
        },
        createdAt:{
            type:Date,
            default:Date.now()
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },  // here author is particular to that review, so we create an author object and 
            // and the reference for the author is the "user" collection
    }
);

const Review= mongoose.model("Review",reviewSchema);

module.exports=Review;