const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const listing = require('./models/listings');
const port = 3000;
const app = express();
const methodOverride = require('method-override');

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.static('public'));
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

// server listening
app.listen(port, () => {
  console.log('Server Active');
});

// index route
app.get('/', async (req, res) => {
  const listings = await listing.find();
  res.render('stayly.ejs', { listings });
});

// show route
app.get('/show/:id', async (req, res) => {
  let { id } = req.params;
  const showListing = await listing.findById(id);
  res.render('show.ejs', { showListing });
});

// new rent route
app.get('/rent', (req, res) => {
  res.render('rent.ejs');
});

// creating rent house
app.post('/rent', async (req, res) => {
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
});

//edit route
app.put('/listing/:id/edit', async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const { title, description, image, price, location, country } = req.body;
  console.log(title, description, image, price, location, country);
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
  console.log(updateListing);
  res.redirect(`/show/${id}`);
});

app.get('/listing/:id/edit', async (req, res) => {
  let { id } = req.params;
  const editListing = await listing.findById(id);
  res.render('edit.ejs', { editListing });
});

// destroy route
app.delete('/listing/:id/delete', async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect('/');
});
