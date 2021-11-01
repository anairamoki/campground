const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/reviews');

const reviews = require('../controllers/reviews');



const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



// Route to review.js - create review 
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))



// :reviewsId removes the ID itself from the campground
// The $pull operator removes from an existing array all instances of a value or values that match a specified condition. (removes by id)


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))



module.exports = router;