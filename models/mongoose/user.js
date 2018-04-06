const mongoose = require('mongoose');
const md5 = require('md5');
const uuid = require('uuid/v4');
const uniqueValidator = require('mongoose-unique-validator');
const Review = require('./review').ReviewSchema;

const UserSchema = mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    facebookId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true
    },
    phone: { type: String, required: false },
    reviews: [Review],
    language: {
      type: String,
      enum: ['en', 'ar'],
      default: 'ar'
    }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

// Create the token before save
UserSchema.pre('save', next => {
  this.token = md5(`${this.email}${uuid()}`);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };
