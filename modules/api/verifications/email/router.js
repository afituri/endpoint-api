const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router.route('/').get(controller.emailVerification);
  router.route('/resend').post(controller.resendEmailVerification);

  return router;
};
