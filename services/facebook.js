const FB = require('fb');
const Promise = require('bluebird');

class FacebookService {
  getUser(token) {
    return new Promise((resolve, reject) => {
      const params = {
        fields: ['id', 'first_name', 'last_name', 'email'],
        access_token: token
      };

      FB.api('me', params, fbData => {
        if (!fbData) {
          reject(new Error('invalid facebook token'));
        } else if (fbData.error) {
          reject(new Error(fbData.error.message));
        } else {
          resolve({
            facebookId: fbData.id,
            fname: fbData.first_name,
            lname: fbData.last_name,
            email: fbData.email
          });
        }
      });
    });
  }
}

module.exports = new FacebookService();
