const mongoose = require("mongoose");

const appReviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },

    comment: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("AppReview", appReviewSchema);