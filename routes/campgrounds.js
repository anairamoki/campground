const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');//requiring to use catchAsync class
const { isLoggedIn, isAuthor, validateCampground }  = require('../middleware');



const Campground = require('../models/campground'); 


router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
}));


router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
}); 


// *catchAsync handles the errors
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  campground.author = req.user_id;
  await campground.save(); //*saving into Campground DB
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`) //*saving user's inputs
}));

//<show.ejs> 
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({//39th
      path: 'reviews', 
      populate: {
        path: 'author'
      }
    }).populate('author'); 
    console.log(campground);
    if (!campground) {//if campground is not found by Id show error message
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
  }
    res.render('campgrounds/show', { campground }); //37th
}));

//<edit.ejs> 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id)
  if (!campground) { //if campground is not found by Id show error message
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}));

// update 
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //51st
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`)
})); 

//DELETE route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground!');
  res.redirect('/campgrounds');
}));

module.exports = router; 
















