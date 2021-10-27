module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){ //req.isAuthenticated comes with password package
    req.flash('error', 'You must be signed in first!')
    return res.redirect('/login');
  }
  next();
}