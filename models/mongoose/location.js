const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema(
  {
    placeId: { type: String, required: true },
    city: { type: String, required: true },
    cityAr: { type: String },
    cityShortName: { type: String },
    state: { type: String, required: true },
    stateAr: { type: String },
    stateShortName: { type: String },
    country: { type: String, required: true },
    countryAr: { type: String },
    countryShortName: { type: String },
    formattedAddress: { type: String, required: true },
    formattedAddressAr: { type: String },
    lat: { type: String },
    lng: { type: String }
  },
  {
    timestamps: true
  }
);

const Location = mongoose.model('Location', LocationSchema);

module.exports = {
  Location,
  LocationSchema
};
