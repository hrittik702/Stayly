const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');
const router = express.Router();
const listingRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const user = require('./models/user.js');
const passport = require('passport');
const localStrategy = require('passport-local');

// view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// connecting to database
const main = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/stayly');
};

main()
  .then((res) => {
    console.log('Database Stayly : Connected');
  })
  .catch((err) => {
    console.log(err);
  });

const sessionOptions = {
  secret: 'WdC2027@fJe',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.warning = req.flash('warning');
  res.locals.info = req.flash('info');
  res.locals.currUser = req.user;
  next();
});

app.get('/flash', (req, res) => {
  let { name = 'anonymous' } = req.query;
  req.session.name = name;
  req.flash('info', `Hello ${name}, flash notifications are fully functional!`);
  res.redirect('/listing');
});

// Routes
app.use('/listing', listingRouter);
app.use('/listing/:id/review', reviewsRouter);
app.use('/user', userRouter);

app.get('/demoUser', async (req, res) => {
  let fakeUser = new user({
    email: 'mmhrittik@gmail.com',
    username: 'hrittik702',
  });
  let password = 'WdC2024@fJe';
  let regUser = await user.register(fakeUser, password);
  res.send(regUser);
});

// All page Error Checking
app.all('/{*splat}', (req, res, next) => {
  next(new ExpressError(404, 'Page not found!'));
});

app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong' } = err;
  res.render('error.ejs', { err });
  // res.status(status).send(message);
});

// server listening
app.listen(port, '0.0.0.0', () => {
  console.log('Server Active');
});
