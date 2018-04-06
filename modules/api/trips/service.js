class TripsService {
  constructor(req) {
    this.req = req;
  }

  fetchTrips() {
    const { Trip } = this.req.models;
    return Trip.find();
  }

  fetchTripById(id) {
    const { Trip } = this.req.models;
    return Trip.findById(id);
  }

  createTrip(data) {
    const { Trip } = this.req.models;
    return Trip.create(data);
  }

  findByIdAndUpdate(id, body) {
    const { Trip } = this.req.models;
    const { phone, language } = body;
    let updates = {};

    if (phone) {
      updates.phone = phone;
    }
    if (language) {
      updates.language = language;
    }
    return Trip.findByIdAndUpdate(id, updates, { new: true });
  }

  deleteTripById(id) {
    const { Trip } = this.req.models;
    return Trip.remove({ _id: id });
  }
}

module.exports = TripsService;
