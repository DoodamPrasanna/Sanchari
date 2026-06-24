const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require('joi');

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },

        url: {
            type: String,
            default: "https://a0.muscache.com/im/pictures/miso/Hosting-46926895/original/2409ed92-70b5-4196-8a66-c065e23ea1d3.jpeg",

            set: (v) => v === ""
                ? "https://a0.muscache.com/im/pictures/miso/Hosting-46926895/original/2409ed92-70b5-4196-8a66-c065e23ea1d3.jpeg"
                : v,
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews:[
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }
});

ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews} });
    }
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing ;