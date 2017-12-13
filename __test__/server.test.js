'use strict';

//this is for express
process.env.PORT = 7000;

//URI is a unique reference identifier...whereas URL is only used for the internet
process.env.MONGODB_URI = 'mongodb://localhost/testing';

// const faker = require('faker');
const superagent = require('superagent');
const Bicycle = require('../model/bicycle');
const server = require('../lib/server');
const logger = require('../lib/logger');

const apiURL = `http://localhost:${process.env.PORT}/api/bicycles`;

const bicycleMockCreate = () => {
  return new Bicycle({
    Brand: 'Mercian',
    Model: 'Vincitore',
    Discipline: 'Randonneur',
  }).save();
};

const bicycleMockCreate2 = () => {
  return new Bicycle({
    Brand: 'Elephant',
    Model: 'NFE',
    Discipline: 'Groad',
  }).save();
};

describe('api/bicycles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  // afterEach(() => Bicycle.remove({}));

  describe('POST /api/bicycles', () => {
    test('POST - should respond with a bicycle and 200 status code if there is no error', () => {
      let bicycleToPost = {
        Brand: 'Cinelli',
        Model: 'Pista',
        Discipline: 'Track',
      };
      return superagent.post(`${apiURL}`)
        .send(bicycleToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.Brand).toEqual(bicycleToPost.Brand);
          expect(response.body.Model).toEqual(bicycleToPost.Model);
          expect(response.body.Type).toEqual(bicycleToPost.Type);
        })
        .catch(error => logger.log(error));
    });
		
    test('POST - should respond with a 400 status code if the bicycle is incomplete', () => {
      let bicycleToPost = {
        Model: 'Supercorsa',
        Discipline: 'Track',
      };
      return superagent.post(`${apiURL}`)
        .send(bicycleToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

		
  describe('GET /api/bicycles', () => {
    test('GET - should respond with a 200 status code if there is no error', () => {
      let bicycleToTest = null;

      return bicycleMockCreate()
        .then(bicycle => {
        //may want to add error checking after this success test
          bicycleToTest = bicycle;
          return superagent.get(`${apiURL}/${bicycle._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(bicycleToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          expect(response.body.Brand).toEqual(bicycleToTest.Brand);
          expect(response.body.Model).toEqual(bicycleToTest.Model);
          expect(response.body.Discipline).toEqual(bicycleToTest.Discipline);		
        })
        .catch(error => logger.log(error));
    });
    test('GET - should respond with a 200 status code if there is no error', () => {
      return bicycleMockCreate()
        .then(() => bicycleMockCreate2())
        .then(() => { 
          return superagent.get(`${apiURL}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(2);
        })
        .catch(error => logger.log(error));
    });
    test('GET - should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/nonsenseISay`)
        .then(Promise.reject) 
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/bicycles/:id', () => {
    test('DELETE - should respond with no body and a 204 status code if there is no error', () => {
      return bicycleMockCreate()
        .then(bicycle => {
          return superagent.delete(`${apiURL}/${bicycle._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE - should respond with a 404 status code if the id is incorrect', () => {
      return superagent.delete(`${apiURL}/`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
