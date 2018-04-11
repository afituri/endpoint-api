const FB = require('fb');
const Promise = require('bluebird');

class FacebookService {
  getUser(token) {
    return new Promise((resolve, reject) => {
      const params = {
        fields: ['id', 'first_name', 'last_name', 'email', 'locale', 'picture'],
        access_token: token
      };

      FB.api('me', params, fbData => {
        if (!fbData) {
          reject(new Error('invalid facebook token'));
        } else if (fbData.error) {
          reject(new Error(fbData.error.message));
        } else {
          let locale = fbData.locale.substring(0, 2);
          if (locale !== 'en' && locale !== 'ar') {
            locale = 'ar';
          }
          resolve({
            facebookId: fbData.id,
            fname: fbData.first_name,
            lname: fbData.last_name,
            email: fbData.email,
            locale,
            picture: `https://graph.facebook.com/${fbData.id}/picture`
          });
        }
      });
    });
  }
}

module.exports = new FacebookService();
