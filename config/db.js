const mongoose = require('../models/mongoose');
module.exports = (app) => {
  app.locals.models = mongoose;
};
