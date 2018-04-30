const aws = require('aws-sdk');
const shortid = require('shortid');
const path = require('path');
const {
  s3Bucket,
  awsAccessKeyId,
  awsSecretAccessKey,
  s3Region,
  s3Url
} = require('../../../config').aws;

class ImageAPIController {
  signS3(req, res) {
    const s3 = new aws.S3({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      region: s3Region
    });
    const extension = path.extname(req.query['file-name']); // to get the extension of the file
    const fileType = req.query['file-type'];
    const fileName = shortid.generate() + extension;
    const s3Params = {
      Bucket: s3Bucket,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log('\nError signing image at GET /images/image-upload-url', err);
        res.status(400).json({ error: err, cod: 'unknownError' });
      }
      const returnData = {
        signedRequest: data,
        url: `${s3Url}/${s3Bucket}/${fileName}`,
        fileName // returnData has a new name for the file
      };
      res.json(returnData);
    });
  }
}

module.exports = new ImageAPIController();
