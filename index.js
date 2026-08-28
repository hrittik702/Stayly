const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const listing = require('./models/listings');
const port = 3000;
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js');
const { schemaValidation } = require('./schema.js');

// view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
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

// index route
app.get(
  '/',
  wrapAsync(async (req, res) => {
    const listings = await listing.find();
    res.render('stayly.ejs', { listings });
  })
);

// show route
app.get(
  '/show/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showListing = await listing.findById(id);
    res.render('show.ejs', { showListing });
  })
);

// new rent route
app.get('/rent', (req, res) => {
  res.render('rent.ejs');
});

// creating rent house
app.post(
  '/rent',
  wrapAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError(400, 'Send valid data for listing');
    }
    const { title, description, image, price, location, country } = req.body;
    await listing.insertOne({
      title: title,
      description: description,
      image: { url: image },
      price: price,
      location: location,
      country: country,
    });
    res.redirect('/');
  })
);

//edit route
app.put(
  '/listing/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    let updateListing = await listing.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        image: { url: image },
        price: price,
        location: location,
        country: country,
      },
      { new: true }
    );
    res.redirect(`/show/${id}`);
  })
);

app.get(
  '/listing/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await listing.findById(id);
    res.render('edit.ejs', { editListing });
  })
);

// destroy route
app.delete(
  '/listing/:id/delete',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/');
  })
);

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
