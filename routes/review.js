const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const listing = require('../models/listings.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(' ');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// review route
router.post(
  '/:id',
  validateReview,
  wrapAsync(async (req, res) => {
    const Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    console.log('new review saved');
    res.redirect(`/listing/${req.params.id}`);
  })
);

router.delete(
  '/:id/:delReview',
  wrapAsync(async (req, res) => {
    let { id, delReview } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: delReview } });
    await Review.findByIdAndDelete(delReview);
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
