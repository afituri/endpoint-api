const { VerificationHash } = require('../models/mongoose');
const EmailService = require('./email');
const { addabba } = require('../config');

const createEmailOptions = (userData, type) => {
  switch (type) {
    case 'accountCreation':
      return {
        from: addabba.email,
        to: userData.email,
        subject: 'Validate your Addabba account',
        html: `<p>Click this <a href="${addabba.apiUrl}/verifications/email?hash=${
          userData.verificationHash
        }">link</a> to confirm your account.</p>
        <p>This link will expire in 20 minutes after registration.</p>`
      };
    case 'passwordReset':
      return {
        from: addabba.email,
        to: userData.email,
        subject: 'Reset your Addabba password',
        html: `<p>Click this <a href="${addabba.apiUrl}/verifications/passreset?hash=${
          userData.verificationHash
        }">link</a> redirect to the password update page</p>
        <p>This link will expire in 20 minutes.</p><br/><p>Please ignore this email if you haven't requested a password reset.</p>`
      };
    default:
      return {};
  }
};

class EmailVerificationService {
  sendVerificationEmail(user, emailType) {
    let { _id, email } = user;
    let hashedData = new VerificationHash({ hash: email, user: _id });
    hashedData
      .save((err, data) => {
        let emailOptions = createEmailOptions(
          {
            verificationHash: data.verificationHash,
            user: data.user,
            email
          },
          emailType
        );
        return EmailService.send(emailOptions);
      })
      .then(() => {})
      .catch(err => {
        return err;
      });
  }
}

module.exports = new EmailVerificationService();
