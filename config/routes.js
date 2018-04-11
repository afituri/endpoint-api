const ApiRouter = require('./router-api-v1');
const { reqLocals } = require('../middleware');
const VerificationRoutes = require('./verification-router')();

module.exports = app => {
  app.use('/api/v1', reqLocals(app), ApiRouter());
  app.use('/verifications', reqLocals(app), VerificationRoutes);
};
