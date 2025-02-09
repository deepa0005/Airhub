const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middelware.js");
const  rewiewController = require("../controllers/reviews.js");






// Review 
//Post Route
router.post("/reviews",
   isLoggedIn,
   isReviewAuthor,
   validateReview,
   wrapAsync(rewiewController.postRoute));


//review Delete route
router.delete("/:reviewId", wrapAsync(rewiewController.destroyRoute));


module.exports = router;