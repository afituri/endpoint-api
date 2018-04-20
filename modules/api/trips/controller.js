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
    let travelType = 'local';

    if (!startPoint) {
      return res.status(400).json({ error: 'You must provide a start point' });
    }

    if (!endPoint) {
      return res.status(400).json({ error: 'You must provide an end point' });
    }

    if (!travelBy || !service) {
      return res.status(400).json({ error: 'You must provide a travel by or a service' });
    }

    if (startPoint.placeId === endPoint.placeId) {
      return res.status(400).json({ error: 'Starting point should not equal Ending point' });
    }

    if (service === 'pool' && travelBy === 'air') {
      return res
        .status(400)
        .json({ error: 'You can not provide Car pool service when traveling by air' });
    }

    startPoint.location = await locationService.fetchLocationFromGoogle(startPoint.placeId);
    endPoint.location = await locationService.fetchLocationFromGoogle(endPoint.placeId);
    delete startPoint.placeId;
    delete endPoint.placeId;

    if (startPoint.location.countryShortName !== endPoint.location.countryShortName) {
      travelType = 'international';
    }

    return tripService
      .createTrip({
        owner,
        startPoint,
        endPoint,
        travelBy,
        travelType,
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

  async servicesRequest(req, res) {
    const tripService = new Service(req);
    const { Request } = req.models;
    const { id } = req.params;
    const {
      service,
      numberOfPassengers,
      numberOfBags,
      weight,
      phone,
      endPointPhone,
      notes
    } = req.body;
    let customer = req.user._id;
    let targetedTrip = await tripService.fetchTripById(id);

    if (!targetedTrip) {
      return res.status(404).json({ error: 'Trip was not found' });
    }
    if (targetedTrip.status !== 'open') {
      return res.status(400).json({ error: 'Requesting a service is not available for this trip' });
    }
    if (service !== targetedTrip.service && targetedTrip.service !== 'both') {
      return res
        .status(400)
        .json({ error: 'The service requested does not match the service provided' });
    }
    if (customer === targetedTrip.owner) {
      return res
        .status(400)
        .json({ error: 'Owners are not allowed to request services for their trips' });
    }

    let request = new Request({
      customer,
      service,
      numberOfBags,
      numberOfPassengers,
      weight,
      phone,
      endPointPhone,
      notes
    });
    await request.save();

    targetedTrip.requests.push(request);
    const updateTrip = tripService.findByIdAndUpdate(id, targetedTrip);
    return updateTrip.then(trip => res.status(201).json({ trip })).catch(e => {
      console.log(`Error at POST /trips/${id}/requests`, e);
      res.status(400).json({ error: e });
    });
  }

  async servicesUpdate(req, res) {
    const tripService = new Service(req);
    const { id, requestId } = req.params;
    const { action } = req.body;
    let owner = req.user._id;
    let targetedTrip = await tripService.fetchTripById(id);

    if (!targetedTrip) {
      return res.status(404).json({ error: 'Trip was not found' });
    }
    if (targetedTrip.status !== 'open') {
      return res.status(400).json({ error: 'Updating a service is not available for this trip' });
    }
    if (owner.toString() !== targetedTrip.owner.toString()) {
      return res.status(400).json({ error: 'Only the owner of this trip is allowed to update' });
    }
    if (action !== 'reject' && action !== 'accept') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const updateTrip = tripService.updateServiceStatus(requestId, action);
    return updateTrip.then(request => res.status(200).json({ request })).catch(e => {
      console.log(`Error at PUT /trips/${id}/requests/${requestId}`, e);
      res.status(400).json({ error: e });
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
