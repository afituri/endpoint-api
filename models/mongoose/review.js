const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    stars: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: null
    },
    reviewType: { type: String, enum: ['traveller', 'customer'] },
    review: { type: String }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = {
  Review,
  ReviewSchema
};
