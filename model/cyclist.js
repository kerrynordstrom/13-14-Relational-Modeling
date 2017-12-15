'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');
const Discipline = require('./discipline');
const httpErrors = require('http-errors');

const cyclistSchema = mongoose.Schema ({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  age: {
    type: Number,
    maxlength: 2,
  },
  eventsEntered: {
    type: Number,
    maxlength: 3,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  discipline: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'discipline',
  },
});


cyclistSchema.pre('save', function (done) {
  return Discipline.findById(this.discipline)
    .then(disciplineFound => {
      if(!disciplineFound) 
        throw httpErrors(404, 'Discipline not found');

      disciplineFound.cyclists.push(this._id);
      return disciplineFound.save();
    })
    .then(() => done())
    .catch(done);
});

cyclistSchema.post('remove', (document, done) => {
  return Discipline.findById(document.discipline)
    .then(disciplineFound => {
      if (!disciplineFound) 
        throw httpErrors(404, 'discipline not found');

      disciplineFound.cyclists = disciplineFound.cyclists.filter( cyclist => {
        return cyclist._id.toString() !== document._id.toString();
      });
      return disciplineFound.save();
    })
    .then(() => done())
    .catch(done);
});


module.exports = mongoose.model('cyclist', cyclistSchema);