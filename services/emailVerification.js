const { VerificationHash } = require('../models/mongoose');
const EmailService = require('./email');
const { addabba } = require('../config');
const messages = require('../messages');
const format = require('string-template');

const createEmailOptions = (userData, type) => {
  let html;
  switch (type) {
    case 'accountCreation':
      html = format(messages.accountCreation[`html-${userData.locale}`], {
        url: addabba.apiUrl,
        hash: userData.verificationHash
      });
      return {
        from: `Addabba <${addabba.email}>`,
        to: userData.email,
        subject: messages.accountCreation[`subject-${userData.locale}`],
        html
      };
    case 'passwordReset':
      html = format(messages.passwordReset[`html-${userData.locale}`], {
        url: addabba.apiUrl,
        hash: userData.verificationHash
      });
      return {
        from: `Addabba <${addabba.email}>`,
        to: userData.email,
        subject: messages.passwordReset[`subject-${userData.locale}`],
        html
      };
    default:
      return {};
  }
};

class EmailVerificationService {
  sendVerificationEmail(user, emailType) {
    let { _id, email, locale } = user;
    let hashedData = new VerificationHash({ hash: email, user: _id });
    hashedData
      .save((err, data) => {
        let emailOptions = createEmailOptions(
          {
            verificationHash: data.verificationHash,
            user: data.user,
            locale,
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
