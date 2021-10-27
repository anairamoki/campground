const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');


// register route form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// register route to submit the form to
router.post('/register', catchAsync(async (req, res, next) => {
  try { //register route logic
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {//keep the user logged in
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
      })
      
  } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
  }
}));

//Login route
router.get('/login', (req, res) => {
  res.render('users/login');
})

//login route to submit the form to
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Bye Bye, you have been logged out!');
  res.redirect('/campgrounds');
})


module.exports = router;