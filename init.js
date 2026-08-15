const mongoose = require('mongoose');
const listing = require('./models/listings');
const { data: sampleListings } = require('./data');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/stayly');
}

main()
  .then(() => {
    console.log('Database Connected');
  })
  .catch((err) => {
    console.log(err);
  });

listing
  .insertMany(sampleListings)
  .then(() => {
    console.log('Insert OK');
  })
  .catch((err) => {
    console.log(err);
  });
