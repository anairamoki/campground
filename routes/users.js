const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const user = require('../controllers/users');


// grouping the routes with commum paths
router.route('/register')
  .get(user.renderUserForm) //render register form
  .post(catchAsync(user.registerUser));// register route to submit the form to


router.route('/login')
  .get(user.renderLogin) //Login route
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser); //login route to submit the form to

// Logout route
router.get('/logout', user.logout);


module.exports = router;