const mongoose = require("mongoose");

const { Schema } = mongoose;

const listeningSchema = new Schema(
    {
        title : {
            type : String,
            required : true
        },
        description : String,
        image : {
            filename : {
                type : String,
                default : "listing image"
            },
           url : {
            type : String,
            default : "https://www.wallpapers13.com/wp-content/uploads/2015/12/Nature-Lake-Bled.-Desktop-background-image-1680x1050.jpg",
            set : 
            (v) => v === "" ? "https://www.wallpapers13.com/wp-content/uploads/2015/12/Nature-Lake-Bled.-Desktop-background-image-1680x1050.jpg" : v,
           },
        },
        price : Number,
        location : String,
        country : String
    }
)


const listing = mongoose.model("Listening", listeningSchema);

module.exports = listing;