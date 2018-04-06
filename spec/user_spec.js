/* eslint-disable */
// Disable all application logging while running tests

console.log = function() {};

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const helpers = require('./helpers/objectCreators');

const { User } = mongoose;

describe('User', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1';
  let server;
  let user;
  let body;
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
    request.post(
      {
        url: `${apiUrl}/users`,
        form: {
          facebookToken
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        user = body.user;
        token = body.id_token;
        done();
      }
    );
  });

  // me
  it('shows the loggedin user at /api/v1/users/me', done => {
    request.get(
      {
        url: `${apiUrl}/users/me`,
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.me.fname).toBe('Ahmed');
        expect(body.me.lname).toBe('Fituri');
        expect(body.me.email).toBe('ahmed.fituri@gmail.com');
        done();
      }
    );
  });

  //usersShow
  it('shows a specific user at /api/v1/users/:id', done => {
    request.get(
      {
        url: `${apiUrl}/users/${user._id}`,
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.user.fname).toBe('Ahmed');
        expect(body.user.lname).toBe('Fituri');
        expect(body.user.email).toBe('ahmed.fituri@gmail.com');
        done();
      }
    );
  });

  it('creats a new user with facebookId', done => {
    request.post(
      {
        url: `${apiUrl}/users`,
        form: {
          facebookToken: facebookToken2
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.user.fname).toBe('Nancy');
        expect(body.user.lname).toBe('Vijayvergiyastein');
        expect(body.user.email).toBe('uibrqeqaca_1521914771@tfbnw.net');
        done();
      }
    );
  });

  it('login with facebook', done => {
    request.post(
      {
        url: `${apiUrl}/users`,
        form: {
          facebookToken: facebookToken
        }
      },
      (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  //usersUpdate
  it('updates a user at /api/v1/users/:id', done => {
    request.put(
      {
        url: `${apiUrl}/users/${user._id}`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          phone: '0925032654',
          language: 'en'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(body.user.language).toBe('en');
        expect(body.user.phone).toBe('0925032654');
        done();
      }
    );
  });
});

// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2 } = helpers;
