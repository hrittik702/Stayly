const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();

router.get(
  '/login',
  wrapAsync(async (req, res) => {
    console.log('hello');
  })
);

module.exports = router;
