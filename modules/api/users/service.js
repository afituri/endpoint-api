class UsersService {
  constructor(req) {
    this.req = req;
  }

  fetchUsers() {
    const { User } = this.req.models;
    return User.find();
  }

  fetchUserById(id) {
    const { User } = this.req.models;
    return User.findById(id);
  }

  createUser(data) {
    const { User } = this.req.models;
    return User.create(data);
  }

  findByIdAndUpdate(id, body) {
    const { User } = this.req.models;
    const { phone, language } = body;
    let updates = {};

    if (phone) {
      updates.phone = phone;
    }
    if (language) {
      updates.language = language;
    }
    return User.findByIdAndUpdate(id, updates, { new: true });
  }

  deleteUserById(id) {
    const { User } = this.req.models;
    return User.remove({ _id: id });
  }
}

module.exports = UsersService;
