const Listing = require("../models/listing.js");
const initData = require("./data.js");
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/haweli";
main().
then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

let initDb = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data base is intitialised");
}

initDb();