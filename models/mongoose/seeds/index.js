const mongoose = require('mongoose');
const models = require('./../../mongoose');
const clean = require('./clean');
const seeds = require('./seeds');
// Assign models to the global namespace
// so we can reference them easily
// in seeds/seeds.js
Object.keys(models).forEach(modelName => {
  global[modelName] = mongoose.model(modelName);
});

require('../../../utils/mongo')()
  // Clean the database
  .then(() => console.log('Cleaning Database...'))
  .then(() => {
    return clean();
  })
  .then(() => console.log('Seeding...'))
  .then(() => {
    return seeds();
  })
  .then(() => console.log('Done'))
  .catch(e => console.error(e))
  .then(() => mongoose.disconnect());
