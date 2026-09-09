const express = require('express');
const router = express.Router({ mergeParams: true });
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

// new rent route
router.get('/rent', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Login to create Listing');
    return res.redirect('/user/login');
  }
  res.render('rent.ejs');
});

// show route
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showListing = await listing.findById(id).populate('reviews');
    if (!showListing) {
      req.flash('error', 'Listing not found!');
      return res.redirect('/listing');
    }
    return res.render('show.ejs', { showListing });
  })
);

// creating rent house
router.post(
  '/rent',
  wrapAsync(async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'New Listing has been added successfully!');
    res.redirect('/listing');
  })
);

//edit route
router.put(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let upListing = req.body.listing;
    let updateListing = await listing.findByIdAndUpdate(id, upListing, { new: true });
    req.flash('success', `"${updateListing.title || 'Listing'}" has been updated successfully!`);

    res.redirect(`/listing/${id}`);
  })
);

router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    if (!editListing) {
      req.flash('error', 'Requested Listing is not found!');
      return res.redirect('/listing');
    }
    res.render('edit.ejs', { editListing });
  })
);

// destroy route
router.delete(
  '/:id/delete',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', 'Listing has been deleted!');
    res.redirect('/listing');
  })
);

// index route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const listings = await listing.find();
    res.render('stayly.ejs', { listings });
  })
);

module.exports = router;
