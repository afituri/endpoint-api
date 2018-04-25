class TripsService {
  constructor(req) {
    this.req = req;
  }

  fetchTrips() {
    const { Trip } = this.req.models;
    return Trip.find({ status: 'open' }).populate('owner', [
      'fname',
      'lname',
      'reviews',
      '_id',
      'picture'
    ]);
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

  updateServiceStatus(requestId, action) {
    const { Trip } = this.req.models;
    let status = action === 'accept' ? 'accepted' : 'rejected';

    return Trip.update(
      { 'requests._id': requestId.toString() },
      { $set: { 'requests.$.status': status } },
      { new: true }
    );
  }

  deleteTripById(id) {
    const { Trip } = this.req.models;
    return Trip.remove({ _id: id });
  }
}

module.exports = TripsService;
