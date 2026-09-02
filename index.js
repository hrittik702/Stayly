const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');
const router = express.Router();
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

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

// listings route
app.use('/listing', listings);

// review route
app.use('/listing/review', reviews);

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
