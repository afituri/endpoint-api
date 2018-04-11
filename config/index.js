const port = process.env.PORT || process.argv[2];
const host = process.env.HOST;
const jwtSecret = process.env.JWT_SECRET || 'abc123';

const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  apiKey: process.env.GOOGLE_API_KEY
};

const addabba = {
  email: process.env.ADDABBA_EMAIL,
  apiUrl: process.env.API_URL,
  feUrl: process.env.FEURL
};

const sendgrid = {
  username: process.env.SENDGRID_USERNAME,
  password: process.env.SENDGRID_PASSWORD
};

module.exports = {
  addabba,
  google,
  host,
  jwtSecret,
  port,
  sendgrid
};
