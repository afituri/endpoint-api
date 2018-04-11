const svc = require('../../../../services/emailVerification');
const { feUrl } = require('../../../../config').addabba;
const Service = require('../service');

class PassresetVerification {
  postPassresetVerification(req, res) {
    const { User } = req.models;
    const { email } = req.body;
    User.findOne({ email })
      .then(user => {
        svc.sendVerificationEmail(user, 'passwordReset');
        return res.status(201).send();
      })
      .catch(() => {
        return res.status(401).json({ error: 'Could not find user with provided email' });
      });
  }

  async getPassresetVerification(req, res) {
    const service = new Service(req);
    const { hash } = req.query;
    if (!hash) {
      return res.status(401).json({ error: 'Hash not provided.' });
    }
    let userData = await service.fetchVerificationHash(hash);
    if (!userData) {
      return res.status(401).json({ error: 'Hash could not be located, or expired' });
    }
    return res.status(201).send(`${feUrl}/reset/${userData.verificationHash}`);
  }

  putPassresetVerification(req, res) {
    const { User, VerificationHash } = req.models;
    const { password, hash, email } = req.body;
    if (!hash || !password || !email) {
      return res.status(401).json({ error: 'Information missing' });
    }
    return VerificationHash.findOneAndRemove({ verificationHash: hash })
      .then(() => {
        return User.findOne({ email });
      })
      .then(userData => {
        userData.password = password;
        return userData.save();
      })
      .then(() => {
        return res.status(201).send();
      })
      .catch(() => {
        return res.status(401).json({
          error: 'Password could not be updated. Incorrect information.'
        });
      });
  }
}

module.exports = new PassresetVerification();