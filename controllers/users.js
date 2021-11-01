const User = require('../models/user');


//to render to register form
module.exports.renderUserForm = (req, res) => {
  res.render('users/register');
}

//register the user 
module.exports.registerUser = async (req, res, next) => {
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
}

//to render to login page
module.exports.renderLogin = (req, res) => {
  res.render('users/login');
}

//login route to submit the form to
module.exports.loginUser = (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}

//logout user
module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Bye Bye, you have been logged out!');
  res.redirect('/campgrounds');
}