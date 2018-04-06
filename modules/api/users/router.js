const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router.route('/').post(controller.usersCreate);

  router.route('/me').get(controller.me);

  router
    .route('/:id')
    .get(controller.usersShow)
    .put(controller.usersUpdate);

  return router;
};
