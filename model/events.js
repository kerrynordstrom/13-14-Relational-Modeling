'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  Event: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  Location: {
    type: String,
    required: true,
    maxlength: 25,
  },
  Stages: {
    type: Number,
    required: true,
    maxlength: 2,
  },
  Date: {
    type: Date,
    required: false,
    maxlength: 15,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

//internally, this becomes 'notes';
module.exports = mongoose.model('event', eventSchema);