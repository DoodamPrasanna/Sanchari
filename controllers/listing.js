const { query } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    console.log("LISTINGS FROM DB:", allListings);
    res.render("Listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("Listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).
    populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
    } 
    res.render("Listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        newListing.geometry = response.body.features[0].geometry ;
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success","New Listing successfully added!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
    } 
    res.render("Listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exists!");
        return res.redirect("/listings");
    }
    // apply updated fields
    listing.set({ ...req.body.listing });

    // geocode new location if provided
    if (req.body.listing && req.body.listing.location) {
        const geoResponse = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();
        if (geoResponse.body.features && geoResponse.body.features[0]) {
            listing.geometry = geoResponse.body.features[0].geometry;
        }
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing successfully updated!");
    res.redirect("/listings");
    console.log(id);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing successfully deleted!");
    res.redirect("/listings");
};