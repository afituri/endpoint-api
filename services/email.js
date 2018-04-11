const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { sendgrid } = require('../config');

const _options = {
  service: 'SendGrid',
  auth: {
    api_user: sendgrid.username,
    api_key: sendgrid.password
  }
};

const _transporter = nodemailer.createTransport(sendGridTransport(_options));

class EmailService {
  send(options) {
    return new Promise((resolve, reject) => {
      _transporter.sendMail(options, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  }
}

module.exports = new EmailService();
