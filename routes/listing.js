const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const listing = require('../models/listings');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/expressError.js');

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(' ');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// index route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const listings = await listing.find();
    res.render('stayly.ejs', { listings });
  })
);

// show route
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showListing = await listing.findById(id).populate('reviews');
    res.render('show.ejs', { showListing });
  })
);

// new rent route
router.get('/rent', (req, res) => {
  res.render('rent.ejs');
});

// creating rent house
router.post(
  '/rent',
  wrapAsync(async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect('/');
  })
);

//edit route
router.put(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let upListing = req.body.listing;
    let updateListing = await listing.findByIdAndUpdate(id, upListing, { new: true });
    res.redirect(`/show/${id}`);
  })
);

router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    res.render('edit.ejs', { editListing });
  })
);

// destroy route
router.delete(
  '/:id/delete',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listing');
  })
);

module.exports = router;
