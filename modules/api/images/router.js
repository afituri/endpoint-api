const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router.route('/image-upload-url').get(controller.signS3);

  return router;
};
