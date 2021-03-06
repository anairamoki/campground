require('dotenv').config();

console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
//const Joi = require('joi'); //require joi can be deleted cause it is being required in schemas.js
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError') 
const methodOverride = require('method-override'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


//Connect Mongoose
mongoose.connect('mongodb://localhost:27017/yelpcampDemo'), {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false
} 

//setting up the DB logic.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

//*? set up to make EJS WORK - MIDLEWARE
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) 
//*? letting express know how to locate the views/templates
//*? path is the global object and __dirname holds current directory address and, 'views' is the folder where all the web pages will be kept.

app.use(express.urlencoded({ extended: true }));//tell express to parse the body
app.use(methodOverride('_method'));//method-override
app.use(express.static(path.join(__dirname, 'public')))//ensure that it always gets the correct path to the public folder.

// To remove data, use:
app.use(mongoSanitize({
  replaceWith: '_'
}));


const sessionConfig = {
  name: 'session',
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
app.use(helmet());

//allowing helmet to use these sources
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, 
                "https://images.unsplash.com/", 
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

// Middleware to use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) //pass user model


// how the data is stored and retrieved in the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);



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
