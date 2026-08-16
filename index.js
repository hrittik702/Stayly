const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const listing = require('./models/listings');
const port = 3000;
const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.static('public'));

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
  res.render('stayly.ejs', {listings});
});

