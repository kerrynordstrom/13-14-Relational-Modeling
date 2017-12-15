'use strict';

//ES5 version
//const Router = require('express').Router;

const {Router} = require('express');

const jsonParser = require('body-parser').json();

const Cyclist = require('../model/cyclist');

const logger = require('../lib/logger');

const httpErrors = require('http-errors');

const cyclistRouter = module.exports = new Router();



//the next callback does not return a promise; this was introduce prior to that functionality
cyclistRouter.post('/api/cyclists', jsonParser, (request, response, next) => {
  if(!request.body.name || !request.body.age) {
    return next(httpErrors(400, 'Name and age are required'));
  }
  return new Cyclist(request.body).save()  
    .then(cyclist => response.json(cyclist))
    .catch(error => next(error));
});

//TODO fix this to reflect "next" syntax
cyclistRouter.get('/api/cyclists', (request, response, next) => {
  const PAGE_SIZE = 5;

  let {page = '0'} = request.query;
  page = Number(page);

  if(isNaN(page))
    page = 0;

  page = page < 0 ? 0 : page;

  let allCyclists = null;

  return Cyclist.find({})
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .then(cyclists => {
      allCyclists = cyclists;
      return Cyclist.find({}).count();
    })
    .then(cyclistCount => {
      let responseData = {
        count: cyclistCount,
        data: allCyclists,
      };

      let lastPage = Math.floor(cyclistCount / PAGE_SIZE);

      response.links({
        next: `http://localhost:${process.env.PORT}/api/cyclists?page=${page === lastPage ? lastPage : page + 1}`,
        prev: `http://localhost:${process.env.PORT}/api/cyclists?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost:${process.env.PORT}/api/cyclists?page=${lastPage}`,
      });
      return response.json(responseData);
    });
});


cyclistRouter.get('/api/cyclists/:id', (request, response, next) => {
  return Cyclist.findById(request.params.id)
    .populate('discipline')
    .then(cyclist => {
      if(!cyclist) {
        throw httpErrors(404, 'Cyclist not found with this id');
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
        throw httpErrors(404, 'Cyclist not found with this id');
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
        throw httpErrors(404, 'Cyclist not found with this id');
      }
      logger.log('info', 'DELETE - responding with a 204 success code at /api/cyclists/:id');
      return response.sendStatus(204);
    })
    .catch(next);
}); 