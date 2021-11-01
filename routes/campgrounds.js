const express = require('express');

const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground }  = require('../middleware');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });

  
// grouping the routes with commom paths - campground routes

router.route('/')
  .get(catchAsync(campgrounds.index))//index page
  // .post(isLoggedIn, 
  //   validateCampground, 
  //   catchAsync(campgrounds.createCampground));
  //    *catchAsync - handles the errors
  .post(upload.array('image'),(req, res) => {
    console.log(req.body, req.files);
    res.send("It worked!")
  }) 


//new campgrounds routes 
router.get('/new', isLoggedIn, campgrounds.renderNewForm); 

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground)) //<show.ejs> show page
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))// update page
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))//DELETE route

//<edit.ejs> edit page 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router; 









