const mongoose = require('mongoose');
const Point = require('./point').PointSchema;
const Request = require('./request').RequestSchema;
const uniqueValidator = require('mongoose-unique-validator');

const TripSchema = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    startPoint: { type: Point, required: true },
    endPoint: { type: Point, required: true },
    travelBy: { type: String, enum: ['land', 'air', 'both'], default: 'land' },
    travelType: { type: String, enum: ['local', 'international'], default: 'local' },
    service: { type: String, enum: ['package', 'pool', 'both'], default: 'package' },
    numberOfPassengers: { type: Number, default: 0 },
    numberOfBags: { type: Number, default: 0 },
    firstHalfPrice: { type: Number, default: 0 },
    additionalHalfPrice: { type: Number, default: 0 },
    maxWeigthInKG: { type: Number },
    passengerPrice: { type: Number, default: 0 },
    vehicleDescription: { type: String, default: '' },
    notes: { type: String },
    requests: [Request],
    autoAccept: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['open', 'active', 'completed', 'expired'],
      default: 'open',
      index: true
    }
  },
  {
    timestamps: true
  }
);

TripSchema.plugin(uniqueValidator);

const Trip = mongoose.model('Trip', TripSchema);

module.exports = { Trip, TripSchema };
