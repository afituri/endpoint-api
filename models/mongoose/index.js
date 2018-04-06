const mongoose = require('mongoose');
const bluebird = require('bluebird');
const User = require('./user').User;
const Location = require('./location').Location;
const Trip = require('./trip').Trip;

mongoose.Promise = bluebird;

module.exports = {
  Location,
  Trip,
  User
};
