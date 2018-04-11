/* eslint-disable */

const moment = require('moment');
const request = require('request');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

module.exports = {
  facebookToken: process.env.FACEBOOK_TOKEN,
  facebookToken2: process.env.FACEBOOK_TOKEN_2,
  user: {
    fname: 'Erlich',
    lname: 'Buckman',
    email: 'erlich@buckman.com',
    password: '11111111',
    locale: 'en',
    status: 'active'
  },
  user2: {
    fname: 'Erlich2',
    lname: 'Buckman2',
    email: 'erlich2@buckman.com',
    facebookId: '222222222'
  },
  trip: {
    startPoint: {
      location: {
        country: 'Algeria',
        countryAr: 'الجزائر',
        city: 'Oran',
        cityAr: 'وهران',
        state: 'Oran Province',
        stateAr: 'ولاية وهران',
        formattedAddress: 'Oran, Algeria',
        formattedAddressAr: 'وهران, الجزائر',
        placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E'
      },
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
      location: {
        country: 'United States',
        countryAr: 'الولايات المتحدة',
        city: 'New York',
        cityAr: 'نيويورك',
        state: 'New York',
        stateAr: 'نيويورك',
        formattedAddress: 'New York, US',
        formattedAddressAr: 'نيويورك, الولايات المتحدة',
        placeId: 'ChIJfVMfhFSIfg0RDyn3Yjf2h0E'
      },
      meetingPoint: 'some start meeting point',
      meetingTime: moment()
        .add(6, 'days')
        .toJSON(),
      phone: '092874737281',
      time: moment()
        .add(5, 'days')
        .toJSON()
    },
    travelType: 'international',
    service: 'package',
    travelBy: 'air',
    firstHalfPrice: 20,
    additionalHalfPrice: 10,
    notes: 'some notes'
  },
  request: {
    service: 'package',
    weight: 2,
    phone: '09250887665',
    endPointPhone: '09755443333',
    notes: 'some package'
  },
  logIn: (facebookToken, apiUrl, cb) => {
    let token = '';
    let user;
    request.post(
      {
        url: `${apiUrl}/users`,
        form: {
          facebookToken
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        token = body.id_token;
        user = body.user;
        cb({ token, user });
      }
    );
  },
  createToken(user) {
    let id_token = jwt.sign(user, jwtSecret, {
      expiresIn: '1h'
    });
    return { user, id_token };
  }
};
