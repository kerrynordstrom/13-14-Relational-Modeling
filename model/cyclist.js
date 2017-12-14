'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');
// const eventSchema = require('event');

const cyclistSchema = mongoose.Schema ({
  name: {
    type: String,
    required: true,
    unique: false,
    maxlength: 50,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
    maxlength: 3,
  },
  discipline: {
    type: String,
    required: false,
    unique: false,
    maxlength: 20,
  },
  eventsEntered: {
    type: Number,
    required: false,
    unique: false,
    maxlength: 3,
  },
  // events: [{ 
  //   type: eventSchema.Types.ObjectId, 
  //   ref: 'Event' }],
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model('cyclist', cyclistSchema);