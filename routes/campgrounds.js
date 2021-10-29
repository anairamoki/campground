const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground }  = require('../middleware');
const Campground = require('../models/campground'); 

// index route
router.get('/', catchAsync(campgrounds.index));

//new campgrounds routes 
router.get('/new', isLoggedIn, campgrounds.renderNewForm); 


//create campgrounds
// *catchAsync - handles the errors
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//<show.ejs> show page
router.get('/:id', catchAsync(campgrounds.showCampground));

//<edit.ejs> edit page 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// update page
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

//DELETE route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router; 