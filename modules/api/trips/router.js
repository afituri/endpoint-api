const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router
    .route('/')
    .get(controller.tripsIndex)
    .post(controller.tripsCreate);

  router.route('/:id/requests').post(controller.servicesRequest);
  router.route('/:id/requests/:requestId').put(controller.servicesUpdate);

  router
    .route('/:id')
    .get(controller.tripsShow)
    .put(controller.tripsUpdate);

  return router;
};
