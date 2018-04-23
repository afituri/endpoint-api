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
        req.customer = user2.customer;
        req.save();
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

  it('creats a new trip by air', done => {
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

  it('creats a new trip by land', done => {
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

  // it('creats a new request', done => {
  //   logIn(facebookToken2, apiUrl, result => {
  //     request.post(
  //       {
  //         url: `${apiUrl}/trips/${trip._id}/requests`,
  //         headers: {
  //           Authorization: `JWT ${result.token}`
  //         },
  //         form: {
  //           service: 'package',
  //           weight: 2,
  //           phone: '09250887665',
  //           endPointPhone: '09755443333',
  //           notes: 'some package'
  //         }
  //       },
  //       (err, res, body) => {
  //         body = JSON.parse(body);
  //         console.log(body.trip.requests);
  //         expect(res.statusCode).toBe(201);
  //         expect(body.trip.requests[0].service).toBe('package');
  //         expect(body.trip.requests[0].weight).toBe(2);
  //         expect(body.trip.requests[0].phone).toBe('09250887665');
  //         expect(body.trip.requests[0].endPointPhone).toBe('09755443333');
  //         expect(body.trip.requests[0].status).toBe('pending');
  //         expect(body.trip.requests[0].notes).toBe('some package');
  //         expect(body.trip.owner).toBe(user._id.toString());
  //         done();
  //       }
  //     );
  //   });
  // });

  // it('Accepts a request', done => {
  //   request.put(
  //     {
  //       url: `${apiUrl}/trips/${trip._id}/requests/${req._id}`,
  //       headers: {
  //         Authorization: `JWT ${token}`
  //       },
  //       form: {
  //         action: 'accept'
  //       }
  //     },
  //     (err, res, body) => {
  //       body = JSON.parse(body);
  //       console.log(body);
  //       done();
  //     }
  //   );
  // });
});

// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2, logIn, createToken } = helpers;
