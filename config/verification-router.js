const express = require('express');
const email = require('../modules/api/verifications/email/router')();
const passreset = require('../modules/api/verifications/passreset/router')();

module.exports = () => {
  const router = express.Router();

  router.use('/email', email);
  router.use('/passreset', passreset);

  return router;
};
