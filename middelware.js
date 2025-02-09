const listing = require("./models/listing");
const reviews = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if (!Listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permission to make any changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    let(error) = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error }= reviewSchema.validate(req.body);
     if (error) {
       const errMsg = error.details.map((el) => el.message).join(",")
         throw new ExpressError(400,errMsg);
     } else {
         next();
     }
 };


 module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId} = req.params;
    let Review = await reviews.findById(reviewId);
    if (!Review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Yoy'r not the author of this reviews");
        return res.redirect(`/listings/${id}`);
    }
    next();
}