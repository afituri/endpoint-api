const express = require('express');
const users = require('../modules/api/users/router')();
const trips = require('../modules/api/trips/router')();
const images = require('../modules/api/images/router')();

module.exports = () => {
  const router = express.Router();

  router.use('/images', images);
  router.use('/users', users);
  router.use('/trips', trips);

  return router;
};
