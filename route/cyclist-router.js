'use strict';

//ES5 version
//const Router = require('express').Router;

const {Router} = require('express');

const jsonParser = require('body-parser').json();

const Cyclist = require('../model/cyclist');
// const Event = require('../model/event');

const logger = require('../lib/logger');

const httpErrors = require('http-errors');

const cyclistRouter = module.exports = new Router();



//the next callback does not return a promise; this was introduce prior to that functionality
cyclistRouter.post('/api/cyclists', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request at /api/cyclists');
	
  if(!request.body.Brand || !request.body.Model) {
    return next(httpErrors(400, 'Body and content are required'));
  }
  return new Cyclist(request.body).save()  
    .then(cyclist => response.json(cyclist)) //this sends a 200 success code
    .catch(next);
});

//TODO fix this to reflect "next" syntax
cyclistRouter.get('/api/cyclists', (request, response, next) => {
  logger.log('info', 'GET - processing a request at /api/cyclists');
  return Cyclist.find({})
    .then(cyclists => {
      return response.json(cyclists);
    })
    .catch(next);
});

cyclistRouter.get('/api/cyclists/:id', (request, response, next) => {
  return Cyclist.findById(request.params.id)
    .then(cyclist => {
      if(!cyclist) {
        throw httpErrors(404, 'note not found');
      }
      logger.log('info', 'GET - responding with a 200 success code at /api/cyclists/:id');
      return response.json(cyclist);
    })
    .catch(next);
});

cyclistRouter.put('/api/cyclists/:id', jsonParser,  (request, response, next) => {
  let options = { runValidators: true, new: true};

  return Cyclist.findByIdAndUpdate(request.params.id, request.body, options)
    .then(cyclist => {
      if(!cyclist) {
        throw httpErrors(404, 'cyclist not found');
      }
      logger.log('info', 'PUT - responding with a 200 success code at /api/cyclists/:id');
      return response.json(cyclist);
    })
    .catch(next);
});

cyclistRouter.delete('/api/cyclists/:id', (request, response, next) => {
  return Cyclist.findByIdAndRemove(request.params.id)
    .then(cyclist => {
      if (!cyclist) {
        throw httpErrors(404, 'note not found');
      }
      logger.log('info', 'DELETE - responding with a 204 success code at /api/cyclists/:id');
      return response.sendStatus(204);
    })
    .catch(next);
}); 