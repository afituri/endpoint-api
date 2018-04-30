/* eslint-disable */

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const fileSystem = require('fs');
const path = require('path');
const helpers = require('./helpers/objectCreators');

const { User } = mongoose;

describe('Image', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1';
  let server;
  let user;
  let token;

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  beforeEach(done => {
    user = new User(helpers.user);
    user.save().then(() => {
      request.post(
        {
          url: `${apiUrl}/users/login`,
          form: {
            email: helpers.user.email,
            password: helpers.user.password
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          token = body.id_token;
          done();
        }
      );
    });
  });

  // ----------------------------------------
  // Image API endpoints
  // ----------------------------------------

  // signAndUploadImagetoS3Bucket
  it('sign the image and upload successfully', done => {
    const filePath = path.join(__dirname, '/images/sample.jpg');
    let fileType = 'image/jpeg',
      fileName = 'sample.jpg',
      url = '';

    request.get(
      {
        url: `${apiUrl}/images/image-upload-url?file-name=${fileName}&file-type=${fileType}`,
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        const stats = fileSystem.statSync(filePath);
        fileSystem.createReadStream(filePath).pipe(
          request(
            {
              method: 'PUT',
              url: body.signedRequest, // uploading the image using signedRequest
              headers: {
                'Content-Length': stats.size
              }
            },
            (err, res, body) => {
              console.log(body);
              expect(res.statusCode).toBe(200);
              done();
            }
          )
        );
      }
    );
  });
  // ----------------------------------------
  // helper functions
  // ----------------------------------------
});
