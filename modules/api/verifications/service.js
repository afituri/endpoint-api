class VerificationsService {
  constructor(req) {
    this.req = req;
  }

  fetchVerifications() {
    const { VerificationHash } = this.req.models;
    return VerificationHash.find();
  }

  fetchVerificationHash(hash) {
    const { VerificationHash } = this.req.models;
    return VerificationHash.findOne({ verificationHash: hash });
  }

  fetchVerificationByQuery(query) {
    const { VerificationHash } = this.req.models;
    return VerificationHash.findOne(query);
  }

  createVerification(data) {
    const { VerificationHash } = this.req.models;
    return VerificationHash.create(data);
  }

  findByIdAndUpdate(id, body) {
    const { VerificationHash } = this.req.models;
    return VerificationHash.findByIdAndUpdate(id, body, { new: true });
  }

  deleteVerificationById(id) {
    const { VerificationHash } = this.req.models;
    return VerificationHash.remove({ _id: id });
  }
}

module.exports = VerificationsService;
