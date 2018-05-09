const Service = require('./service');
const mongoose = require('mongoose');

const Auth = require('../../../services/auth');
const EmailService = require('../../../services/emailVerification');
const FacebookService = require('../../../services/facebook');
const GoogleService = require('../../../services/google');

class UsersAPIController {
  me(req, res) {
    let { user } = req;
    user = user.toObject();
    delete user.passwordHash;
    return res.json({ me: user });
  }

  usersIndex(req, res) {
    const service = new Service(req);

    return service
      .fetchUsers()
      .then(users => {
        return res.json({ users: users });
      })
      .catch(e => {
        console.log('\nError on at usersIndex - GET /users', e);
        return res.status(400).json({ error: e });
      });
  }

  usersShow(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    service
      .fetchUserById(id)
      .then(user => {
        user = user.toObject();
        delete user.passwordHash;
        return res.json({ user });
      })
      .catch(e => {
        console.log(`\nError at GET /users/${id}`, e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  usersCreate(req, res) {
    const service = new Service(req);
    const {
      fname, lname, email, password, locale, facebookToken, googleToken
    } = req.body;
    const validatedUser = service.validateUserRegistrationReq(req.body);

    if (validatedUser.error) {
      return res
        .status(validatedUser.status)
        .json({ error: validatedUser.error, code: validatedUser.code });
    }

    const create = data => {
      service
        .createUser(data)
        .then(user => {
          if (!user.facebookId && !user.googleId) {
            EmailService.sendVerificationEmail(user, 'accountCreation');
          }
          return res.status(201).send(Auth.createToken(user));
        })
        .catch(e => {
          return res
            .status(401)
            .json({ error: `Error persisting user: ${e}`, code: 'unknownError' });
        });
    };

    const findOrCreate = (query, data) => {
      const { User } = req.models;
      return User.findOne(query).then(user => {
        if (user) {
          return res.status(200).send(Auth.createToken(user));
        }
        return create(data);
      });
    };

    if (facebookToken) {
      return FacebookService.getUser(facebookToken)
        .then(data => {
          findOrCreate({ facebookId: data.facebookId }, { status: 'active', ...data });
        })
        .catch(e => {
          console.log('\nError at POST /api/v1/users', e);
          res.status(400).json({ error: e, code: 'unknownError' });
        });
    } else if (googleToken) {
      return GoogleService.getUser(googleToken)
        .then(data => {
          findOrCreate({ googleId: data.googleId }, { status: 'active', ...data });
        })
        .catch(e => {
          console.log('\nError at POST /api/v1/users', e);
          res.status(400).json({ error: e, code: 'unknownError' });
        });
    }
    return create({
      fname,
      lname,
      locale,
      email,
      password
    });
  }

  usersUpdate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const updateUser = service.findByIdAndUpdate(id, req.body);

    updateUser
      .then(user => {
        user = user.toObject();
        delete user.passwordHash;
        res.status(200).json({ user });
      })
      .catch(e => {
        console.log(`Error at PUT /users/${id}`, e);
        res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  usersDelete(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    const deleteUser = service.deleteUserById(id);

    deleteUser.then(() => res.status(200).json({ id })).catch(e => {
      console.log(`Error at Delete /users/${id}`, e);
      return res.status(400).json({ error: e, code: 'unknownError' });
    });
  }

  loginUser(req, res) {
    const { email, password } = req.body;
    const service = new Service(req);

    if (!email || !password) {
      return res.status(400).json({
        error: 'You must send the email and the password.',
        code: 'missingEmailOrPassword'
      });
    }
    return service.logIn(email, password).then(result => {
      if (result.error) {
        return res.status(result.status).json({ error: result.error, code: result.code });
      }
      return res.status(200).send(Auth.createToken(result));
    });
  }

  async fetchUserTrips(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    let trips;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', code: 'invalidId' });
    }

    try {
      trips = await service.fetchUserTrips(id);
      return res.status(200).json({ trips });
    } catch (err) {
      return res.status(400).json({ error: err, code: 'unknownError' });
    }
  }
}

module.exports = new UsersAPIController();
