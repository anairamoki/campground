const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview} = require('../middleware')
const Campground = require('../models/campground');
const Review = require('../models/reviews');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


// Route to review.js 
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// :reviewsId removes the ID itself from the campground
// The $pull operator removes from an existing array all instances of a value or values that match a specified condition. (removes by id)
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;