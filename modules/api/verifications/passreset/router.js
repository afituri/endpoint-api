const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router
    .route('/')
    .post(controller.postPassresetVerification)
    .get(controller.getPassresetVerification)
    .put(controller.putPassresetVerification);

  return router;
};
