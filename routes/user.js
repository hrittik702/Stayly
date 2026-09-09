const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const user = require('../models/user.js');
const passport = require('passport');

// signup
router.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

router.post(
  '/signup',
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      console.log(email, username, password);
      let newUser = new user({ email, username });
      console.log(newUser);
      let regUser = await user.register(newUser, password);
      console.log(regUser);
      req.flash('success', `Welcome to Stayly, ${username}! Your account has been created.`);
      res.redirect('/listing');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/user/signup');
    }
  })
);

// login
router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
  async (req, res) => {
    req.flash('success', 'Welcome back to Stayly!');
    res.redirect('/listing');
  }
);

// logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You have been logged out successfully!');
    res.redirect('/listing');
  });
});

module.exports = router;
