const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/listing.js");
const { listingSchema } = require('../schema.js');
const passport = require('passport');
const localStrategy = require('passport-local');
const { isLoggedIn, isOwner, isValidateListing } = require('../middlewares.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route
router.get("/", wrapAsync(listingController.index));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm ); 


//Show Route
router.get("/:id", wrapAsync( listingController.showListing ));


//Create Route
router.post("/", isLoggedIn,  upload.single("listing[image]"), isValidateListing, wrapAsync(listingController.createListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.renderEditForm));


//Update Route
router.put("/:id", isLoggedIn, wrapAsync(isOwner),upload.single("listing[image]"), isValidateListing, wrapAsync(listingController.updateListing));


//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.deleteListing));

 
module.exports = router;

























// //Index Route
// app.get("/listings", wrapAsync(async (req, res) => {
//     let allListings = await Listing.find();
//     res.render("Listings/index.ejs", { allListings });
// }));


// //New Route
// app.get("/listings/new", (req, res) => {
//     res.render("Listings/new.ejs");
// })


// //Show Route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("Listings/show.ejs", { listing });
// }));


// //Create Route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
// }));


// //Edit Route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("Listings/edit.ejs", { listing });
// }));


// //Update Route
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect("/listings");
//     console.log(id);
// }));


// //Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));