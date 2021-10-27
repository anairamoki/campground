const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');//requiring to use catchAsync class
const { campgroundSchema } = require('../schemas');
const { isLoggedIn }  = require('../middleware/middleware');


const ExpressError = require('../utils/ExpressError') //requiring to use ExpressError class
const Campground = require('../models/campground'); //23rd - requiring models

const validateCampground = (req, res, next) => {
  //pass the data through to the schema
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


//31st - Adding Route to campgrounds folder <index.ejs> 
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds}) // 35th step
}));


// 40th - Adding Route to campgrounds folder <new.ejs> 
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
}); 

// 42nd - ending point 
// *catchAsync handles the errors
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  await campground.save(); //*saving into Campground DB
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`) //*saving user's inputs
}));

// 36th - Adding Route to campgrounds folder <show.ejs> 
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id) //39th
    if (!campground) {//if campground is not found by Id show error message
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
  }
    res.render('campgrounds/show', { campground }); //37th
}));

//44th - Adding Route to campgrounds folder <edit.ejs> 
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if (!campground) { //if campground is not found by Id show error message
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
}
  res.render('campgrounds/edit', { campground });
}));

// 49th 
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //51st
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`)
})); 

//52nd - DELETE route
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground!');
  res.redirect('/campgrounds');
}));

module.exports = router; 



 












