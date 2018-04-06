const express = require('express');
const users = require('../modules/api/users/router')();
const trips = require('../modules/api/trips/router')();

module.exports = () => {
  const router = express.Router();

  router.use('/users', users);
  router.use('/trips', trips);

  return router;
};
