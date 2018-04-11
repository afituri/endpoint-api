const request = require('request-promise');
const Promise = require('bluebird');

const { google } = require('../config');

class GoogleService {
  constructor() {
    this.getUser = this.getUser.bind(this);
  }

  getUser(token) {
    const options = {
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
      qs: { id_token: token },
      json: true
    };

    return request(options).then(resp => {
      return new Promise((resolve, reject) => {
        if (resp.aud !== google.clientId) {
          return reject(new Error('invalid google token'));
        }
        return resolve(this.normalizeUserResponse(resp));
      });
    });
  }

  normalizeUserResponse(raw) {
    if (raw.locale !== 'en' && raw.locale !== 'ar') {
      raw.locale = 'ar';
    }
    return {
      googleId: raw.sub,
      fname: raw.given_name,
      lname: raw.family_name,
      email: raw.email,
      picture: raw.picture,
      locale: raw.locale
    };
  }
}

module.exports = new GoogleService();
