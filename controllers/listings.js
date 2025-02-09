const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route
module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index', { allListings });

};


//new route
module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new");

};


//show route
module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listingData = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    if (!listingData) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    console.log(listingData);
    res.render("listings/show", { listing: listingData });
}



//create route
module.exports.createListings = async (req, res, next) => {
   let response = await geocodingClient.forwardGeocode({
       query: req.body.listing.location,
        limit: 1
    })
        .send();
      
      

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
      
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
};



//edit route
module.exports.editListings = async (req, res) => {
    let { id } = req.params;
    const listingData = await listing.findById(id);
    if (!listingData) {
        req.flash("error", "listing your request for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listingData.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "upload/h_300,w_250");


    res.render("listings/edit.ejs", { listing: listingData, originalImageUrl });
};



//update route
module.exports.updateListings = async (req, res) => {
    const { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename };
        await Listing.save();
    }

    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
};


//delete route
module.exports.deleteListings = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await listing.findByIdAndDelete(id);
    console.log(`Deleted Listing: ${deletedListing}`);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");

};