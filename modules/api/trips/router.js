const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router.route('/').post(controller.tripsCreate);

  router
    .route('/:id')
    .get(controller.tripsShow)
    .put(controller.tripsUpdate);

  return router;
};
