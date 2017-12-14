'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');
const Discipline = require('./discipline');
const httpErrors = require('http-errors');

const cyclistSchema = mongoose.Schema ({
  name: {
    type: String,
    required: true,
    unique: false,
    maxlength: 50,
  },
  age: {
    type: Number,
    required: false,
    unique: false,
    maxlength: 3,
  },
  eventsEntered: {
    type: Number,
    required: false,
    unique: false,
    maxlength: 3,
  },
  discipline: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'discipline',
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
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
    .catch(done); //this catch will trigger an error
});
  //Document = the note that I JUST removed
cyclistSchema.post('remove', (document, done) => {
  return Discipline.findById(document.discipline)
    .then(disciplineFound => {
      if (!disciplineFound) 
        throw httpErrors(404, 'discipline not found');

      disciplineFound.cyclists = disciplineFound.cyclists.filter( cyclist => {
        return cyclist._id.toString !== document._id.toString();
      });
    })
    .then(() => done());

});


module.exports = mongoose.model('cyclist', cyclistSchema);