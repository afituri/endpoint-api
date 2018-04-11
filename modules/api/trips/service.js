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

  fetchTripByQuery(query) {
    const { Trip } = this.req.models;
    return Trip.findOne(query);
  }

  createTrip(data) {
    const { Trip } = this.req.models;
    return Trip.create(data);
  }

  findByIdAndUpdate(id, body) {
    const { Trip } = this.req.models;
    return Trip.findByIdAndUpdate(id, body, { new: true });
  }

  deleteTripById(id) {
    const { Trip } = this.req.models;
    return Trip.remove({ _id: id });
  }
}

module.exports = TripsService;
