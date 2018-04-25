const Service = require('./service');
const LocationService = require('../locations/service');
const mongoose = require('mongoose');

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
        return res.status(400).json({ error: e, code: 'unknownError' });
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
        return res.status(400).json({ error: e, code: 'unknownError' });
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
      return res
        .status(400)
        .json({ error: 'You must provide a start point', code: 'missingStartPoint' });
    }

    if (!endPoint) {
      return res
        .status(400)
        .json({ error: 'You must provide an end point', code: 'missingEndPoint' });
    }

    if (!travelBy || !service) {
      return res.status(400).json({
        error: 'You must provide a travel by or a service',
        code: 'missingServiceOrTravelBy'
      });
    }

    if (startPoint.placeId === endPoint.placeId) {
      return res
        .status(400)
        .json({ error: 'Starting point should not equal Ending point', code: 'startEqualsEnd' });
    }

    if (service === 'pool' && travelBy === 'air') {
      return res.status(400).json({
        error: 'You can not provide Car pool service when traveling by air',
        code: 'airAndPool'
      });
    }

    startPoint.location = await locationService.fetchLocationFromGoogle(startPoint.placeId);
    endPoint.location = await locationService.fetchLocationFromGoogle(endPoint.placeId);
    delete startPoint.placeId;
    delete endPoint.placeId;
    let travelType =
      startPoint.location.countryShortName !== endPoint.location.countryShortName
        ? 'international'
        : 'local';

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
        return res.status(400).json({ error: e, code: 'unknownError' });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', code: 'invalidId' });
    }

    let targetedTrip = await tripService.fetchTripById(id);

    if (!targetedTrip) {
      return res.status(404).json({ error: 'Trip was not found', code: 'tripNotFound' });
    }
    if (targetedTrip.status !== 'open') {
      return res.status(400).json({
        error: 'Requesting a service is not available for this trip',
        code: 'requestNotAvailable'
      });
    }
    if (service !== targetedTrip.service && targetedTrip.service !== 'both') {
      return res.status(400).json({
        error: 'The service requested does not match the service provided',
        code: 'serviceDoesNotMatch'
      });
    }
    if (customer.toString() === targetedTrip.owner.toString()) {
      return res.status(400).json({
        error: 'Owners are not allowed to request services for their trips',
        code: 'requestFromOwner'
      });
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
      res.status(400).json({ error: e, code: 'unknownError' });
    });
  }

  async servicesUpdate(req, res) {
    const tripService = new Service(req);
    const { id, requestId } = req.params;
    const { action } = req.body;
    let owner = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: 'Invalid ID', code: 'invalidId' });
    }

    let trip = await tripService.fetchTripById(id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip was not found', code: 'tripNotFound' });
    }
    if (trip.status !== 'open') {
      return res.status(400).json({
        error: 'Updating a service is not available for this trip',
        code: 'updateNotAvailable'
      });
    }
    if (owner.toString() !== trip.owner.toString()) {
      return res.status(400).json({
        error: 'Only the owner of this trip is allowed to update',
        code: 'onlyOwnersUpdate'
      });
    }
    if (action !== 'reject' && action !== 'accept') {
      return res.status(400).json({ error: 'Invalid action', code: 'invalidAction' });
    }

    try {
      await tripService.updateServiceStatus(requestId, action);
      trip = await tripService.fetchTripById(id);
      return res.status(200).json({ trip });
    } catch (err) {
      console.log(`Error at PUT /trips/${id}/requests/${requestId}`, err);
      return res.status(400).json({ error: err, code: 'unknownError' });
    }
  }

  tripsUpdate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const updateTrip = service.findByIdAndUpdate(id, req.body);

    updateTrip.then(trip => res.status(200).json({ trip })).catch(e => {
      console.log(`Error at PUT /trips/${id}`, e);
      res.status(400).json({ error: e, code: 'unknownError' });
    });
  }

  tripsDelete(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    const deleteTrip = service.deleteTripById(id);

    deleteTrip.then(() => res.status(200).json({ id })).catch(e => {
      console.log(`Error at Delete /trips/${id}`, e);
      return res.status(400).json({ error: e, code: 'unknownError' });
    });
  }
}

module.exports = new TripsAPIController();
