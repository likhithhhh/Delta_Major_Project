// THIS PAGE IS FOR INITIALISING THE DATA FOR THE WEBPAGE..

const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js"); //why should we keep two dots here????

main().then((res)=>console.log("connection success"))
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB= async function(){
    await Listing.deleteMany({});
    let newData = initData.map((obj)=>({...obj,owner:"676908c811ab4f2f78475091"}));
    // console.log(newData);
    // this function adds the additional property "owner" along with the other properties in the object.
    await Listing.insertMany(newData);
    console.log("data was initialsed");
}

initDB();