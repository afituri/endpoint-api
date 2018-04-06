/* eslint-disable */
// Disable all application logging while running tests

console.log = function() {};

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const moment = require('moment');
const helpers = require('./helpers/objectCreators');

const { Trip } = mongoose;

describe('Trip', () => {
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

  it('creats a new trip', done => {
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
        done();
      }
    );
  });
});

// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2 } = helpers;
