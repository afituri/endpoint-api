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
        return res
          .status(404)
          .json({ error: 'Could not find user with provided email', code: 'emailNotFound' });
      });
  }

  async getPassresetVerification(req, res) {
    const service = new Service(req);
    const { hash } = req.query;
    if (!hash) {
      return res.status(401).json({ error: 'Hash not provided.', code: 'missingHash' });
    }
    let userData = await service.fetchVerificationHash(hash);
    if (!userData) {
      return res
        .status(401)
        .json({ error: 'Hash could not be located, or expired', code: 'hashNotFound' });
    }
    return res.redirect(`${feUrl}reset/${userData.verificationHash}`);
  }

  async putPassresetVerification(req, res) {
    const { User, VerificationHash } = req.models;
    const { password, hash } = req.body;
    if (!hash || !password) {
      return res.status(401).json({ error: 'Information missing', code: 'missingInformation' });
    }
    let vh;
    let userData;
    try {
      vh = await VerificationHash.findOne({ verificationHash: hash });
      await VerificationHash.findOneAndRemove({ _id: vh._id });
      userData = await User.findOne({ _id: vh.user });
      userData.password = password;
      await userData.save();
    } catch (err) {
      return res.status(401).json({
        error: 'Password could not be updated. Incorrect information.',
        code: 'passwordNotUpdaated'
      });
    }
    return res.status(201).send();
  }
}

module.exports = new PassresetVerification();
