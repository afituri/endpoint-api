const port = process.env.PORT || process.argv[2];
const host = process.env.HOST;
const jwtSecret = process.env.JWT_SECRET || 'abc123';

const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  apiKey: process.env.GOOGLE_API_KEY
};

const aws = {
  s3Bucket: process.env.S3_BUCKET || 'addabba',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Url: process.env.S3_URL || 'https://s3-us-west-1.amazonaws.com',
  s3Region: process.env.S3_REGION || 'us-west-1'
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
  aws,
  google,
  host,
  jwtSecret,
  port,
  sendgrid
};
