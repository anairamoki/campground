const express = require('express'); //4th step
const path = require('path'); //13th step -> setting up EJS
const mongoose = require('mongoose'); // 20th step - Connecting Mongoose
const ejsMate = require('ejs-mate'); // 55th - require ejs-mate
//const Joi = require('joi'); //require joi can be deleted cause it is being required in schemas.js
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError') //requiring to use ExpressError class
const methodOverride = require('method-override'); // 47th
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');// requireing user model


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


//20th step - Connect Mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp'), {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false
} 

// 21st - setting up the DB logic.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();//4th step

//*? set up to make EJS WORK - MIDLEWARE
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) //*? letting express know how to locate the views/templates - 13th step

app.use(express.urlencoded({ extended: true }));// 43rd- tell express to parse the body
app.use(methodOverride('_method'));//48th - use the method-override
app.use(express.static(path.join(__dirname, 'public')))//ensure that it always gets the correct path to the public folder.

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}


app.use(session(sessionConfig)); //has to come before app.use(passport.session());
app.use(flash());

// Middleware to use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) //pass user model


// how the data is stored and retrieved in the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  //req.user - authomatically access the current user. Saved in currentUser variable.
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


// basic routes -6th step
app.get('/', (req, res) => {
  res.render('home')
});

//handling all errors
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

//handling errors 
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on Port 3000')
})







