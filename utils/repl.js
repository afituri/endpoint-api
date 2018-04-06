const mongoose = require('mongoose');
const repl = require('repl').start({});
const Mongoose = require('../models/mongoose');
const models = {
  mongoose: Mongoose
};

require('./mongo')().then(() => {
  repl.context.models = models;

  // ----------------------------------------
  // Mongoose
  // ----------------------------------------
  Object.keys(models.mongoose).forEach((modelName) => {
    repl.context[modelName] = mongoose.model(modelName);
  });

  // ----------------------------------------
  // Logging
  // ----------------------------------------
  // repl.context.lg = (data) => {
  //   if (Array.isArray(data)) {
  //     if (data.length && data[0].dataValues) {
  //       data = data.map(item => item.dataValues);
  //     }
  //   }
  // };
});
