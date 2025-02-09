const Review = require("../models/reviews.js");
const listing = require("../models/listing.js");


//Post route
module.exports.postRoute = async (req, res) => {
    let Listing = await listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();

    res.redirect(`/listings/${listing._id}`)
};


//Delete route
module.exports.destroyRoute = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findById(reviewId);

    res.redirect(`/listings/${id}`);
};