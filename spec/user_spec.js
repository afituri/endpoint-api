/* eslint-disable */
// Disable all application logging while running tests

console.log = function() {};

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const helpers = require('./helpers/objectCreators');

const { User, VerificationHash } = mongoose;

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
  // Authentication Routes
  // ----------------------------------------
  describe('Registration Route', () => {
    // Registers new user
    it('adds a new user when they register', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            email: 'frogman1@gmail.com',
            password: 'iamthefrogman',
            fname: 'Mr.',
            lname: 'Fantastic',
            locale: 'en'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(201);
          expect(body.id_token).toBeDefined();
          expect(body.user.email).toBe('frogman1@gmail.com');
          expect(body.user.fname).toBe('Mr.');
          expect(body.user.lname).toBe('Fantastic');
          expect(body.user.passwordHash).toBeUndefined();
          expect(body.user.locale).toBe('en');
          expect(body.user.status).toBe('inactive');
          done();
        }
      );
    });

    it('doesnt register a user if their password is too short', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            email: 'frogman2@gmail.com',
            password: '1234567',
            fname: 'Mr.',
            lname: 'Fantastic'
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(400);
          done();
        }
      );
    });

    it('doesnt register a user if their password is too long', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            email: 'frogman2@gmail.com',
            password:
              '12345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678',
            fname: 'Mr.',
            lname: 'Fantastic'
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(400);
          done();
        }
      );
    });

    it('doesnt register a user if their email isnt supplied', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            password: '123456789',
            fname: 'Mr.',
            lname: 'Fantastic'
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(400);
          done();
        }
      );
    });

    it('doesnt register a user if a password isnt supplied', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            email: 'frogman2@gmail.com',
            fname: 'Mr.',
            lname: 'Fantastic'
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(400);
          done();
        }
      );
    });

    it('doesnt register a user if a name isnt supplied', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            email: 'frogman2@gmail.com',
            password: '12345678'
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(400);
          done();
        }
      );
    });

    it('registers a new user with facebookId', done => {
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
  });

  describe('Login Route', () => {
    it('returns a signed JWT on successful login', done => {
      request.post(
        {
          url: `${apiUrl}/users/login`,
          form: {
            email: 'erlich@buckman.com',
            password: '11111111'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(200);
          expect(body.id_token).toBeDefined();
          expect(body.user.email).toBe('erlich@buckman.com');
          expect(body.user.fname).toBe('Erlich');
          expect(body.user.lname).toBe('Buckman');
          expect(body.user.locale).toBe('en');
          expect(body.user.status).toBe('active');
          expect(body.user.passwordHash).toBeUndefined();
          expect(body.error).toBe(undefined);
          done();
        }
      );
    });

    it('returns error when email or password not provided on login', done => {
      request.post(
        {
          url: `${apiUrl}/users/login`,
          form: {
            email: 'dev1@addabba.com'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(400);
          expect(body.error).toBeDefined();
          done();
        }
      );
    });

    it('returns an error if user cant be found', done => {
      request.post(
        {
          url: `${apiUrl}/users/login`,
          form: {
            email: 'frag@addabba.com',
            password: '11111111'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(401);
          expect(body.id_token).toBe(undefined);
          expect(body.error).toBeDefined();
          done();
        }
      );
    });

    it('register and login with facebook', done => {
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            facebookToken: facebookToken
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(201);
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
        }
      );
    });
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
        expect(body.me.fname).toBe('Erlich');
        expect(body.me.lname).toBe('Buckman');
        expect(body.me.email).toBe('erlich@buckman.com');
        expect(body.me.passwordHash).toBeUndefined();
        expect(body.me.status).toBe('active');
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
        expect(body.user.fname).toBe('Erlich');
        expect(body.user.lname).toBe('Buckman');
        expect(body.user.email).toBe('erlich@buckman.com');
        expect(body.user.passwordHash).toBeUndefined();
        expect(body.user.status).toBe('active');
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
          fname: 'Mark',
          lname: 'Stephen',
          phone: '0925032654',
          picture: 'https://somepic.com/mypic.jpg',
          password: 'myNewPassword',
          locale: 'en'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(body.user.fname).toBe('Mark');
        expect(body.user.lname).toBe('Stephen');
        expect(body.user.picture).toBe('https://somepic.com/mypic.jpg');
        expect(body.user.locale).toBe('en');
        expect(body.user.phone).toBe('0925032654');
        expect(body.user.passwordHash).toBeUndefined();

        //Can login with new password
        request.post(
          {
            url: `${apiUrl}/users/login`,
            form: {
              email: 'erlich@buckman.com',
              password: 'myNewPassword'
            }
          },
          (err, res, body) => {
            body = JSON.parse(body);
            expect(res.statusCode).toBe(200);
            expect(body.error).toBe(undefined);
            done();
          }
        );
      }
    );
  });
  // ----------------------------------------
  // Verification
  // ----------------------------------------
  describe('Email Verification', () => {
    it('creates a hash for a user on registration', done => {
      let _id;
      request.post(
        {
          url: `${apiUrl}/users`,
          form: {
            email: 'frogman1@gmail.com',
            password: 'iamthefrogman',
            fname: 'Mr.',
            lname: 'Fantastic'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          User.findOne({ email: 'frogman1@gmail.com' })
            .then(newUser => {
              return VerificationHash.findOne({ user: newUser._id });
            })
            .then(data => {
              expect(data.user).toBeDefined();
              request.get(
                {
                  url: `${baseUrl}/verifications/email?hash=${data.verificationHash}`
                },
                (verifyErr, verifyRes, verifyBody) => {
                  expect(verifyRes.statusCode).toBe(404);
                  User.findOne({ email: 'frogman1@gmail.com' }).then(newUser => {
                    expect(newUser.status).toBe('active');
                    done();
                  });
                }
              );
            });
        }
      );
    });
    it('throws an error when an incorrect hash is provided', done => {
      let _id;
      request.get(
        {
          url: `${baseUrl}/verifications/email?hash=alskfjdlkajsdflkjasldkjfasd`
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(401);
          expect(body.error).toBeDefined();
          done();
        }
      );
    });

    it('post a request to base/verifications/email/resend', done => {
      User.findByIdAndUpdate(user._id, { status: 'inactive' }, { new: true }).then(user1 => {
        request.post(
          {
            url: `${baseUrl}/verifications/email/resend`,
            form: { email: 'erlich@buckman.com' }
          },
          (err, res, body) => {
            expect(res.statusCode).toBe(201);
            expect(body.error).toBe(undefined);
            User.findOne({ email: 'erlich@buckman.com' })
              .then(user => {
                return VerificationHash.findOne({ user: user._id });
              })
              .then(hash => {
                expect(hash).toBeDefined();
                //redirecting to update page from confirmed link
                hash = hash.verificationHash;
                request.get(
                  {
                    url: `${baseUrl}/verifications/email?hash=${hash}`
                  },
                  (err1, res1, body1) => {
                    expect(res1.statusCode).toBe(404);
                    //does not resend when a user is already activated
                    request.post(
                      {
                        url: `${baseUrl}/verifications/email/resend`,
                        form: { email: 'erlich@buckman.com' }
                      },
                      (err, res, body) => {
                        body = JSON.parse(body);
                        expect(res.statusCode).toBe(400);
                        expect(body.error).toBeDefined();
                        done();
                      }
                    );
                  }
                );
              });
          }
        );
      });
    });
  });
  describe('Passreset Verification', () => {
    //End to end unit tests
    // I decided to make this one test since it is a transactional process.
    // This test expects all the public side effects to be in order at every step of the transaction.
    // Feedback is welcome.

    //requesting a reset link
    it('post a request to base/verify/passreset', done => {
      request.post(
        {
          url: `${baseUrl}/verifications/passreset`,
          form: { email: 'erlich@buckman.com' }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(201);
          expect(body.error).toBe(undefined);
          User.findOne({ email: 'erlich@buckman.com' })
            .then(user => {
              return VerificationHash.findOne({ user: user._id });
            })
            .then(hash => {
              expect(hash).toBeDefined();
              //redirecting to update page from confirmed link
              hash = hash.verificationHash;
              request.get(
                {
                  url: `${baseUrl}/verifications/passreset?hash=${hash}`
                },
                (err1, res1, body1) => {
                  //Does not redirect with incorrect hash
                  request.get(
                    {
                      url: `${baseUrl}/verifications/passreset?hash=${hash}1`
                    },
                    (err2, res2, body2) => {
                      expect(res2.statusCode).toBe(401);
                      //Successfully updates password
                      request.put(
                        {
                          method: 'PUT',
                          url: `${baseUrl}/verifications/passreset`,
                          form: {
                            password: 'lattitude',
                            hash: hash
                          }
                        },
                        (err3, res3, body3) => {
                          expect(res3.statusCode).toBe(201);
                          //Can login with new password
                          request.post(
                            {
                              url: `${apiUrl}/users/login`,
                              form: {
                                email: 'erlich@buckman.com',
                                password: 'lattitude'
                              }
                            },
                            (err4, res4, body4) => {
                              body4 = JSON.parse(body4);
                              expect(res4.statusCode).toBe(200);
                              expect(body4.error).toBe(undefined);
                              //Verification hash is removed upon update
                              VerificationHash.findOne({
                                verificationHash: hash
                              }).then(hash => {
                                expect(hash).toBeNull();
                                done();
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
        }
      );
    });
    it('doesnt send an email if user doesnt exist', done => {
      request.post(
        {
          url: `${baseUrl}/verifications/passreset`,
          form: { email: 'erlich1@buckman.com' }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(404);
          expect(body.error).toBeDefined();
          done();
        }
      );
    });
  });
});

// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2 } = helpers;
