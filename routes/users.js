const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');


// register router form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// register router to submit the form to
router.post('/register', catchAsync(async (req, res, next) => {
  try { //register route logic
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
  } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
  }
}));

//Login router
router.get('/login', (req, res) => {
  res.render('users/login');
})

//login router to submit the form to
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'Welcome Back!');
  res.redirect('/campgrounds')

})

module.exports = router;