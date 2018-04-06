const Service = require('./service');

const Auth = require('../../../services/auth');
const FacebookService = require('../../../services/facebook');
const GoogleService = require('../../../services/google');

class UsersAPIController {
  me(req, res) {
    return res.json({ me: req.user });
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
        return res.json({ user });
      })
      .catch(e => {
        console.log(`\nError at GET /users/${id}`, e);
        return res.status(400).json({ error: e });
      });
  }

  usersCreate(req, res) {
    const service = new Service(req);

    const create = data => {
      service
        .createUser(data)
        .then(user => {
          return res.status(201).send(Auth.createToken(user));
        })
        .catch(e => {
          return res.status(401).json({ error: `Error persisting user: ${e}` });
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

    if (req.body.facebookToken) {
      FacebookService.getUser(req.body.facebookToken)
        .then(data => {
          findOrCreate({ facebookId: data.facebookId }, data);
        })
        .catch(e => {
          console.log('\nError at POST /api/v1/users', e);
          res.status(400).json({ error: e });
        });
    } else if (req.body.googleToken) {
      GoogleService.getUser(req.body.googleToken)
        .then(data => {
          findOrCreate({ googleId: data.googleId }, data);
        })
        .catch(e => {
          console.log('\nError at POST /api/v1/users', e);
          res.status(400).json({ error: e });
        });
    }
  }

  usersUpdate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const updateUser = service.findByIdAndUpdate(id, req.body);

    updateUser.then(user => res.status(200).json({ user })).catch(e => {
      console.log(`Error at PUT /users/${id}`, e);
      res.status(400).json({ error: e });
    });
  }

  usersDelete(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    const deleteUser = service.deleteUserById(id);

    deleteUser.then(() => res.status(200).json({ id })).catch(e => {
      console.log(`Error at Delete /users/${id}`, e);
      return res.status(400).json({ error: e });
    });
  }
}

module.exports = new UsersAPIController();
