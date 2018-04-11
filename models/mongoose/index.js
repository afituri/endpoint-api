const mongoose = require('mongoose');
const bluebird = require('bluebird');
const User = require('./user').User;
const Location = require('./location').Location;
const Trip = require('./trip').Trip;
const Request = require('./request').Request;
const VerificationHash = require('./verificationHash');

mongoose.Promise = bluebird;

module.exports = {
  Location,
  Request,
  Trip,
  User,
  VerificationHash
};
