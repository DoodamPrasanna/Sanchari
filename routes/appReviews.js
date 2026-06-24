const express = require("express");
const router = express.Router();

const AppReview = require("../models/appReviews");

// Show all app reviews
router.get("/", async (req, res) => {

    const appreviews = await AppReview.find({});

    res.render("appreviews/index", {
    appreviews,
});

});

// Add review
router.post("/", async (req, res) => {

    const newReview = new AppReview({
        username: req.body.username,
        rating: req.body.rating,
        comment: req.body.comment,
    });

    await newReview.save();

    req.flash("success", "Review submitted successfully!");

    res.redirect("/appreviews");
});

module.exports = router;