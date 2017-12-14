'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');

const disciplineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 10,
  },
  cyclists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cyclist'}],
  // events: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'event'}],
  timestamp: {
    type: Date,
    default: () => new Date(),
  }, 
},
{
  usePushEach: true,
});

//internally, this becomes 'disciplines' Mongoose adds an S, so this must be accounted for.  

//A more explicit example is category, which must have its reference defined as 'categorie' since Mongoose will render it as 'categories';

module.exports = mongoose.model('discipline', disciplineSchema);