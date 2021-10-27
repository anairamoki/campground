const express = require('express');
const router = express.Router();
const User = require('../models/user');


// register router form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// router to submit the form to
router.post('/register', async(req, res) => {
  res.send(req.body);

})


module.exports = router;