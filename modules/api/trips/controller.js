const Service = require('./service');
const LocationService = require('../locations/service');

class TripsAPIController {
  tripsIndex(req, res) {
    const service = new Service(req);
    return service
      .fetchTrips()
      .then(trips => {
        return res.json({ trips: trips });
      })
      .catch(e => {
        console.log('\nError on at tripsIndex - GET /trips', e);
        return res.status(400).json({ error: e });
      });
  }

  tripsShow(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    service
      .fetchTripById(id)
      .then(trip => {
        return res.json({ trip });
      })
      .catch(e => {
        console.log(`\nError at GET /trips/${id}`, e);
        return res.status(400).json({ error: e });
      });
  }

  async tripsCreate(req, res) {
    const tripService = new Service(req);
    const locationService = new LocationService(req);
    const {
      travelBy,
      service,
      startPoint,
      endPoint,
      numberOfPassengers,
      numberOfBags,
      passengerPrice,
      firstHalfPrice,
      additionalHalfPrice,
      vehicleDescription,
      notes
    } = req.body;
    const owner = req.user._id;

    if (!startPoint) {
      return res.status(400).json({ error: 'You must provide a start point' });
    }

    if (!endPoint) {
      return res.status(400).json({ error: 'You must provide an end point' });
    }

    if (!travelBy || !service) {
      return res.status(400).json({ error: 'You must provide a travel by' });
    }

    startPoint.location = await locationService.fetchLocationFromGoogle(startPoint.placeId);
    endPoint.location = await locationService.fetchLocationFromGoogle(endPoint.placeId);
    delete startPoint.placeId;
    delete endPoint.placeId;

    return tripService
      .createTrip({
        owner,
        startPoint,
        endPoint,
        travelBy,
        service,
        numberOfPassengers,
        numberOfBags,
        passengerPrice,
        firstHalfPrice,
        additionalHalfPrice,
        vehicleDescription,
        notes
      })
      .then(trip => {
        return res.status(201).send({ trip });
      })
      .catch(e => {
        console.log('\nError at POST /trips', e);
        return res.status(400).json({ error: e });
      });
  }

  tripsUpdate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const updateTrip = service.findByIdAndUpdate(id, req.body);

    updateTrip.then(trip => res.status(200).json({ trip })).catch(e => {
      console.log(`Error at PUT /trips/${id}`, e);
      res.status(400).json({ error: e });
    });
  }

  tripsDelete(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    const deleteTrip = service.deleteTripById(id);

    deleteTrip.then(() => res.status(200).json({ id })).catch(e => {
      console.log(`Error at Delete /trips/${id}`, e);
      return res.status(400).json({ error: e });
    });
  }
}

module.exports = new TripsAPIController();
