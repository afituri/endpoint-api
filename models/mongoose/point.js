const mongoose = require('mongoose');
const Location = require('./location').LocationSchema;

const PointSchema = mongoose.Schema(
  {
    location: { type: Location, require: true },
    meetingPoint: { type: String },
    meetingTime: { type: Date },
    phone: { type: String, default: null },
    time: { type: Date }
  },
  {
    timestamps: true
  }
);

const Point = mongoose.model('Point', PointSchema);

module.exports = {
  Point,
  PointSchema
};
