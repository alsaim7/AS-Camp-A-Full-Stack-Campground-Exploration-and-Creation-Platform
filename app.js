if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// console.log(process.env.cloudinaryCloudName);

const apiKey = process.env.maptilerApiKey; // Assuming your key is named maptilerApiKey
// console.log(`Your MapTiler API Key: ${apiKey}`);

const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/ExpressError')
const campgroundsRouter = require('./routes/campgroundRoutes')
const reviewsRouter = require('./routes/reviewRoutes')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose');
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const userRouter = require('./routes/userRoutes')
const mongoSanetize = require('express-mongo-sanitize')
const helmet = require('helmet')
const mongoStore= require('connect-mongo')

mongoose.set('strictQuery', true);
// const dbUrl = 'mongodb://127.0.0.1:27017/as-camp'
const dbUrl = process.env.dbUrl
mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to server successfully');
  })
  .catch((err) => {
    console.error('Error connecting to server:', err.message);
  });


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(mongoSanetize())


const store= mongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24*60*60,
  crypto: {
    secret: `${process.env.mySecret}`
  }
})


const sessionOptions = {
  store: store,
  name: 'session',
  secret: `${process.env.mySecret}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true, // we want that when we deploy our application
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionOptions))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // added for MapTiler
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // added for MapTiler
];
const connectSrcUrls = [
  "https://api.maptiler.com/", // added for MapTiler
];
const imgSrc = [
  "'self'",
  "blob:",
  "data:",
  `https://res.cloudinary.com/${process.env.cloudinaryCloudName}/`, // adjust with your Cloudinary name
  "https://api.maptiler.com/", // added for MapTiler
];
const fontSrcUrls = ["https://fonts.gstatic.com/"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", ...imgSrc],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
  // console.log(req.session.returnTo)
  res.locals.user = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})


app.use('/', userRouter)
app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:idCamp/reviews', reviewsRouter)


app.get('/', (req, res) => {
  res.render('home')
})


app.use('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) {
    err.message = 'Something Went Wrong'
  }
  res.status(status).render('errorTemplate', { err })
})


app.listen(3000, () => {
  console.log('Your Port is 3000');
})