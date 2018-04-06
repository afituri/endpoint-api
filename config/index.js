const port = process.env.PORT || process.argv[2];
const host = process.env.HOST;
const jwtSecret = process.env.JWT_SECRET || 'abc123';

const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  apiKey: process.env.GOOGLE_API_KEY
};

module.exports = {
  google,
  host,
  jwtSecret,
  port
};
