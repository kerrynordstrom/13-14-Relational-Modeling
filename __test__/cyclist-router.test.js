'use strict';

//this is for express
process.env.PORT = 7000;

//URI is a unique reference identifier...whereas URL is only used for the internet
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');


const cyclistMock = require('./lib/cyclist-mock');
const disciplineMock = require('./lib/discipline-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/cyclists`;

describe('api/cyclists', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(cyclistMock.remove());

  describe('POST /api/cyclists', () => {
    test.only('POST - should respond with a bicycle and 200 status code if there is no error', () => {
	  let tempDisciplineMock = null;
	  return disciplineMock.create()
        .then(mock => {
          tempDisciplineMock = mock;

          let cyclistToPost = {
            name: faker.name,
            age: faker.random.number(1),
            eventsEntered: faker.random.number(1),
            discipline: mock._id,
          };
          return superagent.post(`${apiURL}`)
            .send(cyclistToPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
		      expect(response.body.timestamp).toBeTruthy();
		      expect(response.body.eventsEntered).toBeTruthy();
              expect(response.body.discipline).toEqual(tempDisciplineMock._id.toString());
              expect(response.body.name).toEqual(cyclistToPost.name);
              expect(response.body.age).toEqual(cyclistToPost.age);
            });
        });
    });
    test('POST - should respond with a 400 status code if the bicycle is incomplete', () => {
      let cyclistToPost = {
        age: faker.random.number(2),
        eventsEntered: faker.random.number(3),
      };
      return superagent.post(`${apiURL}`)
        .send(cyclistToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });



  test('POST - should respond with a 400 status code if the bicycle is incomplete', () => {
    return superagent.post(`${apiURL}`)
      .send({
        name: faker.name,
        age: faker.random.number(1),
        eventsEntered: faker.random.number(1),
        discipline: 'BAD_ID_BOI',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(404);
      });
  });
});


describe('GET /api/bicycles/:id', () => {
  test('GET - should respond with a 200 status code if there is no error', () => {
    let tempMock = null;

    return cyclistMock.create()
      .then(mockCyclist => {

        tempMock = mockCyclist;
        return superagent.get(`${apiURL}/${mockCyclist.cyclist._id}`);
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body._id).toEqual(tempMock.cyclist._id.toString());
        expect(response.body.timestamp).toBeTruthy();
        
        expect(response.body.name).toEqual(tempMock.name);
        expect(response.body.age).toEqual(tempMock.age);
        expect(response.body.eventsEntered).toEqual(tempMock.eventsEntered);

        expect(response.body.discipline._id).toEqual(tempMock.discipline._id.toString());
        expect(response.body.discipline.name).toEqual(tempMock.discipline.name);
        expect(JSON.stringify(response.body.discipline.cyclists)).toEqual(JSON.stringify(tempMock.discipline.cyclists));
      });
  });

  describe('GET /api/bicycles/', () => {
    test('GET - should respond with a 200 status code if there is no error', () => {
      return cyclistMock.createMany(50)
        .then(manyCyclists => {
          return superagent.get(`${apiURL}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.count).toEqual(50);
        });
    });
  });

  test('GET - should respond with a 404 status code if the id is incorrect', () => {
    return superagent.get(`${apiURL}/nonsenseISay`)
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(404);
      });
  });
});

describe('PUT /api/bicycles', () => {
  test('PUT - should respond with a 200 status code if there is no error', () => {
    let cyclistToUpdate = null;

    return cyclistMock.create()
      .then(mock => {
        cyclistToUpdate = mock.cyclist;
        return superagent.put(`${apiURL}/${mock.cyclist._id}`)
          .send({ name: 'Niels Albert' });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body._id).toEqual(cyclistToUpdate._id.toString());
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body.name).toEqual('Niels Albert');
        expect(response.body.age).toEqual(cyclistToUpdate.age);
      });
  });
});

describe('DELETE /api/bicycles/:id', () => {
  test('DELETE - should respond with no body and a 204 status code if there is no error', () => {
    return cyclistMock.create()
      .then(mock => {
        return superagent.delete(`${apiURL}/${mock.cyclist._id}`);
      })
      .then(response => {
        expect(response.status).toEqual(204);
      });
  });

  test('DELETE - should respond with a 404 status code if the id is incorrect', () => {
    return superagent.delete(`${apiURL}/noooope`)
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(404);
      });
  });
});
