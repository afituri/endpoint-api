const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
    service: { type: String, enum: ['package', 'pool'], default: 'package' },
    numberOfPassengers: { type: Number, default: 0 },
    numberOfBags: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    phone: { type: String, required: true },
    endPointPhone: { type: String, default: '' },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'expired'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Request = mongoose.model('Request', RequestSchema);

module.exports = {
  Request,
  RequestSchema
};
