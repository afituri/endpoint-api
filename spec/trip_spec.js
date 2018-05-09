/* eslint-disable */
// Disable all application logging while running tests

//console.log = function() {};

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const moment = require('moment');
const helpers = require('./helpers/objectCreators');

const { Trip, User, Location, Request } = mongoose;

describe('Trip', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1';
  let server;
  let user;
  let user2;
  let req;
  let trip;
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
    user
      .save()
      .then(() => {
        user2 = new User(helpers.user2);
        user2.save();
      })
      .then(() => {
        trip = new Trip(helpers.trip);
        trip.owner = user._id;
        trip.save();
      })
      .then(() => {
        req = new Request(helpers.request);
        req.customer = user2._id;
        req.save();
      })
      .then(() => {
        trip.requests.push(req);
        trip.save();
      })
      .then(() => {
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

  it('shows user trips', done => {
    request.get(
      {
        url: `${apiUrl}/users/${user._id}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.trips[0].travelBy).toBe('air');
        expect(body.trips[0].service).toBe('package');
        expect(body.trips[0].startPoint.location.placeId).toBe('ChIJfVMfhFSIfg0RDyn3Yjf2h0E');
        expect(body.trips[0].startPoint.meetingPoint).toBe('some start meeting point');
        expect(body.trips[0].startPoint.phone).toBe('092874737282');
        expect(body.trips[0].startPoint.location.country).toBe('Algeria');
        expect(body.trips[0].startPoint.location.city).toBe('Oran');
        expect(body.trips[0].startPoint.location.state).toBe('Oran Province');
        expect(body.trips[0].startPoint.location.countryAr).toBe('الجزائر');
        expect(body.trips[0].startPoint.location.cityAr).toBe('وهران');
        expect(body.trips[0].startPoint.location.stateAr).toBe('ولاية وهران');
        expect(body.trips[0].endPoint.location.placeId).toBe('ChIJOwg_06VPwokRYv534QaPC8g');
        expect(body.trips[0].endPoint.meetingPoint).toBe('some end meeting point');
        expect(body.trips[0].endPoint.phone).toBe('092874737281');
        expect(body.trips[0].endPoint.location.country).toBe('United States');
        expect(body.trips[0].endPoint.location.city).toBe('New York');
        expect(body.trips[0].endPoint.location.state).toBe('New York');
        expect(body.trips[0].endPoint.location.countryAr).toBe('الولايات المتحدة');
        expect(body.trips[0].endPoint.location.cityAr).toBe('نيويورك');
        expect(body.trips[0].endPoint.location.stateAr).toBe('نيويورك');
        expect(body.trips[0].travelType).toBe('international');
        expect(body.trips[0].status).toBe('open');
        done();
      }
    );
  });

  it('gets all trips', done => {
    request.get(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.trips[0].owner.fname).toBe('Erlich');
        expect(body.trips[0].owner.lname).toBe('Buckman');
        expect(body.trips[0].owner.picture).toBe('/somephoto');
        expect(body.trips[0].travelBy).toBe('air');
        expect(body.trips[0].service).toBe('package');
        expect(body.trips[0].startPoint.location.placeId).toBe('ChIJfVMfhFSIfg0RDyn3Yjf2h0E');
        expect(body.trips[0].startPoint.meetingPoint).toBe('some start meeting point');
        expect(body.trips[0].startPoint.phone).toBe('092874737282');
        expect(body.trips[0].startPoint.location.country).toBe('Algeria');
        expect(body.trips[0].startPoint.location.city).toBe('Oran');
        expect(body.trips[0].startPoint.location.state).toBe('Oran Province');
        expect(body.trips[0].startPoint.location.countryAr).toBe('الجزائر');
        expect(body.trips[0].startPoint.location.cityAr).toBe('وهران');
        expect(body.trips[0].startPoint.location.stateAr).toBe('ولاية وهران');
        expect(body.trips[0].endPoint.location.placeId).toBe('ChIJOwg_06VPwokRYv534QaPC8g');
        expect(body.trips[0].endPoint.meetingPoint).toBe('some end meeting point');
        expect(body.trips[0].endPoint.phone).toBe('092874737281');
        expect(body.trips[0].endPoint.location.country).toBe('United States');
        expect(body.trips[0].endPoint.location.city).toBe('New York');
        expect(body.trips[0].endPoint.location.state).toBe('New York');
        expect(body.trips[0].endPoint.location.countryAr).toBe('الولايات المتحدة');
        expect(body.trips[0].endPoint.location.cityAr).toBe('نيويورك');
        expect(body.trips[0].endPoint.location.stateAr).toBe('نيويورك');
        expect(body.trips[0].travelType).toBe('international');
        expect(body.trips[0].status).toBe('open');
        done();
      }
    );
  });

  it('creates a new trip by air', done => {
    request.post(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          startPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          endPoint: {
            placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
            meetingPoint: 'some end meeting point',
            meetingTime: moment()
              .add(6, 'days')
              .toJSON(),
            phone: '092874737281',
            time: moment()
              .add(5, 'days')
              .toJSON()
          },
          travelBy: 'air',
          service: 'package',
          firstHalfPrice: 20,
          additionalHalfPrice: 10,
          notes: 'some notes'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.trip.travelBy).toBe('air');
        expect(body.trip.service).toBe('package');
        expect(body.trip.startPoint.location.placeId).toBe('ChIJfVMfhFSIfg0RDyn3Yjf2h0E');
        expect(body.trip.startPoint.meetingPoint).toBe('some start meeting point');
        expect(body.trip.startPoint.phone).toBe('092874737282');
        expect(body.trip.startPoint.location.country).toBe('Algeria');
        expect(body.trip.startPoint.location.city).toBe('Oran');
        expect(body.trip.startPoint.location.state).toBe('Oran Province');
        expect(body.trip.startPoint.location.countryAr).toBe('الجزائر');
        expect(body.trip.startPoint.location.cityAr).toBe('وهران');
        expect(body.trip.startPoint.location.stateAr).toBe('ولاية وهران');
        expect(body.trip.endPoint.location.placeId).toBe('ChIJOwg_06VPwokRYv534QaPC8g');
        expect(body.trip.endPoint.meetingPoint).toBe('some end meeting point');
        expect(body.trip.endPoint.phone).toBe('092874737281');
        expect(body.trip.endPoint.location.country).toBe('United States');
        expect(body.trip.endPoint.location.city).toBe('New York');
        expect(body.trip.endPoint.location.state).toBe('New York');
        expect(body.trip.endPoint.location.countryAr).toBe('الولايات المتحدة');
        expect(body.trip.endPoint.location.cityAr).toBe('نيويورك');
        expect(body.trip.endPoint.location.stateAr).toBe('نيويورك');
        expect(body.trip.travelType).toBe('international');
        done();
      }
    );
  });

  it('creates a new trip by land', done => {
    request.post(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          startPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          endPoint: {
            placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
            meetingPoint: 'some end meeting point',
            meetingTime: moment()
              .add(6, 'days')
              .toJSON(),
            phone: '092874737281',
            time: moment()
              .add(5, 'days')
              .toJSON()
          },
          travelBy: 'land',
          service: 'pool',
          passengerPrice: 20,
          vehicleDescription: 'Audi AC, radio',
          notes: 'some notes about the road'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.trip.travelBy).toBe('land');
        expect(body.trip.service).toBe('pool');
        expect(body.trip.passengerPrice).toBe(20);
        expect(body.trip.notes).toBe('some notes about the road');
        expect(body.trip.vehicleDescription).toBe('Audi AC, radio');
        expect(body.trip.startPoint.location.placeId).toBe('ChIJfVMfhFSIfg0RDyn3Yjf2h0E');
        expect(body.trip.startPoint.meetingPoint).toBe('some start meeting point');
        expect(body.trip.startPoint.phone).toBe('092874737282');
        expect(body.trip.startPoint.location.country).toBe('Algeria');
        expect(body.trip.startPoint.location.city).toBe('Oran');
        expect(body.trip.startPoint.location.state).toBe('Oran Province');
        expect(body.trip.startPoint.location.countryAr).toBe('الجزائر');
        expect(body.trip.startPoint.location.cityAr).toBe('وهران');
        expect(body.trip.startPoint.location.stateAr).toBe('ولاية وهران');
        expect(body.trip.endPoint.location.placeId).toBe('ChIJOwg_06VPwokRYv534QaPC8g');
        expect(body.trip.endPoint.meetingPoint).toBe('some end meeting point');
        expect(body.trip.endPoint.phone).toBe('092874737281');
        expect(body.trip.endPoint.location.country).toBe('United States');
        expect(body.trip.endPoint.location.city).toBe('New York');
        expect(body.trip.endPoint.location.state).toBe('New York');
        expect(body.trip.endPoint.location.countryAr).toBe('الولايات المتحدة');
        expect(body.trip.endPoint.location.cityAr).toBe('نيويورك');
        expect(body.trip.endPoint.location.stateAr).toBe('نيويورك');
        expect(body.trip.travelType).toBe('international');
        done();
      }
    );
  });

  it('fails to create a trip with missing endpoint', done => {
    request.post(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          startPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          travelBy: 'air',
          service: 'package',
          firstHalfPrice: 20,
          additionalHalfPrice: 10,
          notes: 'some notes'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('missingEndPoint');
        done();
      }
    );
  });

  it('fails to create a trip with missing startpoint', done => {
    request.post(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          endPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          travelBy: 'air',
          service: 'package',
          firstHalfPrice: 20,
          additionalHalfPrice: 10,
          notes: 'some notes'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('missingStartPoint');
        done();
      }
    );
  });

  it('fails to create a trip with mismatches service and travel by', done => {
    request.post(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          startPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          endPoint: {
            placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
            meetingPoint: 'some end meeting point',
            meetingTime: moment()
              .add(6, 'days')
              .toJSON(),
            phone: '092874737281',
            time: moment()
              .add(5, 'days')
              .toJSON()
          },
          travelBy: 'air',
          service: 'pool',
          firstHalfPrice: 20,
          additionalHalfPrice: 10,
          notes: 'some notes'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('airAndPool');
        done();
      }
    );
  });

  it('fails to create a trip with matching start and end points', done => {
    request.post(
      {
        url: `${apiUrl}/trips`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          startPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          endPoint: {
            placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E',
            meetingPoint: 'some start meeting point',
            meetingTime: moment()
              .add(3, 'days')
              .toJSON(),
            phone: '092874737282',
            time: moment()
              .add(4, 'days')
              .toJSON()
          },
          travelBy: 'air',
          service: 'pool',
          firstHalfPrice: 20,
          additionalHalfPrice: 10,
          notes: 'some notes'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('startEqualsEnd');
        done();
      }
    );
  });

  it('creates a new request', done => {
    logIn(facebookToken2, apiUrl, result => {
      request.post(
        {
          url: `${apiUrl}/trips/${trip._id}/requests`,
          headers: {
            Authorization: `JWT ${result.token}`
          },
          form: {
            service: 'package',
            weight: 2,
            phone: '09250887665',
            endPointPhone: '09755443333',
            notes: 'some package'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(201);
          expect(body.trip.requests[0].service).toBe('package');
          expect(body.trip.requests[0].weight).toBe(2);
          expect(body.trip.requests[0].phone).toBe('09250887665');
          expect(body.trip.requests[0].endPointPhone).toBe('09755443333');
          expect(body.trip.requests[0].status).toBe('pending');
          expect(body.trip.requests[0].notes).toBe('some package');
          expect(body.trip.owner).toBe(user._id.toString());
          done();
        }
      );
    });
  });

  it('fails to request using invalid ID', done => {
    logIn(facebookToken2, apiUrl, result => {
      request.post(
        {
          url: `${apiUrl}/trips/${trip._id}s/requests`,
          headers: {
            Authorization: `JWT ${result.token}`
          },
          form: {
            service: 'package',
            weight: 2,
            phone: '09250887665',
            endPointPhone: '09755443333',
            notes: 'some package'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(400);
          expect(body.error).toBeDefined();
          expect(body.code).toBe('invalidId');
          done();
        }
      );
    });
  });

  it('fails to request from a non existing trip', done => {
    logIn(facebookToken2, apiUrl, result => {
      request.post(
        {
          url: `${apiUrl}/trips/${req._id}/requests`,
          headers: {
            Authorization: `JWT ${result.token}`
          },
          form: {
            service: 'package',
            weight: 2,
            phone: '09250887665',
            endPointPhone: '09755443333',
            notes: 'some package'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(404);
          expect(body.error).toBeDefined();
          expect(body.code).toBe('tripNotFound');
          done();
        }
      );
    });
  });

  it('fails to request using a wrong service', done => {
    logIn(facebookToken2, apiUrl, result => {
      request.post(
        {
          url: `${apiUrl}/trips/${trip._id}/requests`,
          headers: {
            Authorization: `JWT ${result.token}`
          },
          form: {
            service: 'pool',
            phone: '09250887665',
            endPointPhone: '09755443333',
            notes: 'some package'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(400);
          expect(body.error).toBeDefined();
          expect(body.code).toBe('serviceDoesNotMatch');
          done();
        }
      );
    });
  });

  it('fails to request by the owner of trip', done => {
    request.post(
      {
        url: `${apiUrl}/trips/${trip._id}/requests`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          service: 'package',
          weight: 2,
          phone: '09250887665',
          endPointPhone: '09755443333',
          notes: 'some package'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('requestFromOwner');
        done();
      }
    );
  });

  it('Accepts a request', done => {
    request.put(
      {
        url: `${apiUrl}/trips/${trip._id}/requests/${req._id}`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          action: 'accept'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(body.trip.owner).toBe(user._id.toString());
        expect(body.trip.requests[0]._id).toBe(req._id.toString());
        expect(body.trip.requests[0].customer).toBe(user2._id.toString());
        expect(body.trip.requests[0].service).toBe('package');
        expect(body.trip.requests[0].weight).toBe(2);
        expect(body.trip.requests[0].status).toBe('accepted');
        expect(body.trip.requests[0].phone).toBe('09250887665');
        expect(body.trip.requests[0].notes).toBe('some package');
        expect(body.trip.requests[0].endPointPhone).toBe('09755443333');
        done();
      }
    );
  });

  it('Fails to accept a request using invalid id', done => {
    request.put(
      {
        url: `${apiUrl}/trips/wrongID/requests/${req._id}`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          action: 'accept'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('invalidId');
        done();
      }
    );
  });

  it('Fails to accept a request using a wrong id', done => {
    request.put(
      {
        url: `${apiUrl}/trips/${req._id}/requests/${req._id}`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          action: 'accept'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(404);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('tripNotFound');
        done();
      }
    );
  });

  it('Fails to accept a request using the wrong action', done => {
    request.put(
      {
        url: `${apiUrl}/trips/${trip._id}/requests/${req._id}`,
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          action: 'something'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.error).toBeDefined();
        expect(body.code).toBe('invalidAction');
        done();
      }
    );
  });

  it('Fails to accept a request by different owner', done => {
    logIn(facebookToken2, apiUrl, result => {
      request.put(
        {
          url: `${apiUrl}/trips/${trip._id}/requests/${req._id}`,
          headers: {
            Authorization: `JWT ${result.token}`
          },
          form: {
            action: 'accept'
          }
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(400);
          expect(body.error).toBeDefined();
          expect(body.code).toBe('onlyOwnersUpdate');
          done();
        }
      );
    });
  });
});

// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2, logIn, createToken } = helpers;
