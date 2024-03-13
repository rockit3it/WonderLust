const express = require("express");
const app = express();
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const MONGO_URL = "mongodb://127.0.0.1:27017/haweli";
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
// to use static files with out project
main().
then(() => {
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}
const port = 3000;
app.listen(port,() => {
    console.log(`app is listening on ${port}`);
})
app.get("/",(req,res) => {
    res.send("hey there");
})

app.get("/listings",wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const idData = await Listing.findById(id);
    res.render("listings/show.ejs",{listing : idData});
}));
// New route
app.get("/listing/new",(req,res)=>{
    res.render("listings/addListing.ejs");
})
// for adding the new element create route
app.post("/listings",wrapAsync(async (req, res, next)=>{
    try{
        const {title, description, image, price, location, country} = req.body;
    await Listing.insertMany({title, description, image, price, location, country});
    res.redirect("/listings");
    }
    catch(err){
        return next(err);
    }
}));

// for deleting the listing we are making the request on the perticular id
app.get("/listings/:id/delete", wrapAsync(async(req, res)=>{
    const {id} = req.params;
    await Listing.findOneAndDelete({ _id: id}).then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect("/listings");
}));
app.get("/listings/:id/edit",wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
// for updating the information
app.put("/listings/:id",wrapAsync(async(req,res, next)=>{
        let {id} = req.params;
        // let {title, image, price, location, country} = req.body;
        const data = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        console.log({...req.body.listing});
        res.redirect("/listings");
}));
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})
app.use((err, req, res, next)=>{
    let{statusCode, message} = err;
    res.status(statusCode).send(message);
})