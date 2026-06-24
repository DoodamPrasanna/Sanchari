const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require("../models/listing.js");
const { isValidateReview, isLoggedIn, isAuthor } = require('../middlewares.js');
const reviewController = require('../controllers/review.js');



//Reviews Route
router.post("/", isLoggedIn, isValidateReview, wrapAsync( reviewController.createReview ));

//Reviews Delete Route
router.delete("/:reviewId", isLoggedIn, wrapAsync(isAuthor), wrapAsync(reviewController.deleteReview));

module.exports = router;