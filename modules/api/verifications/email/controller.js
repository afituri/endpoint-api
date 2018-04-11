const { feUrl } = require('../../../../config').addabba;
const Service = require('../service');
const UserService = require('../../users/service');
const svc = require('../../../../services/emailVerification');

class EmailVerificationController {
  async emailVerification(req, res) {
    const service = new Service(req);
    const userService = new UserService(req);
    if (!req.query.hash) {
      return res.status(401).json({ error: 'Get back you dirty dog!' });
    }
    const hash = req.query.hash;
    let userData = await service.fetchVerificationHash(hash);
    if (!userData) {
      return res.status(401).json({ error: 'Hash could not be located, or expired' });
    }
    return userService
      .activateUser(userData.user)
      .then(() => {
        return res.redirect(`${feUrl}`);
      })
      .catch(() => res.status(401).json({ error: 'User could not be located' }));
  }

  resendEmailVerification(req, res) {
    const { User } = req.models;
    const { email } = req.body;
    User.findOne({ email: email })
      .then(user => {
        if (user.status === 'inactive') {
          svc.sendVerificationEmail(user, 'accountCreation');
          return res.status(201).send();
        }
        return res.status(400).json({ error: 'Account already verified' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Could not find user with provided email' });
      });
  }
}

module.exports = new EmailVerificationController();
