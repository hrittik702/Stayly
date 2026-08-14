const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;
const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.static('public'));

// server listening
app.listen(port, () => {
  console.log('Server Active');
});

app.get('/', (req, res) => {
  res.render('stayly.ejs');
});
