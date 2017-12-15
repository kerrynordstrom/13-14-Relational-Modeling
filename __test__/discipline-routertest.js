'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const disciplineMock = require('./lib/discipline-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/disciplines`;

describe('api/disciplines', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(disciplineMock.remove);

  describe('POST /disciplines', () => {
    test.only('POST - should respond with a 200 status code if there is no error', () => {
      return superagent.post(`${apiURL}`)
        .send({
          name: 'Randonneur',
          cyclists: ['Lars Boom', 'Lars Van der Haar', 'Zdenek Stybar'],
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.cyclists).toEqual(['Lars Boom', 'Lars Van der Haar', 'Zdenek Stybar']);
        });
    });

    test('POST - should respond with a 400 status code if the bicycle is incomplete', () => {
      let disciplineToPost = {
        cyclists: ['Lars Boom', 'Lars Van der Haar', 'Zdenek Stybar'],
      };
      return superagent.post(`${apiURL}`)
        .send(disciplineToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });


  test('POST - should respond with a 409 status code if the category is a duplicate', () => {
    return disciplineMock.create()
      .then(discipline => {
        return superagent.post(`${apiURL}`)
          .send({
            name: discipline.name,
            cyclists: [],
          });
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(409);
      });
  });
});

describe('GET /api/disciplines/:id', () => {
  test('GET - should respond with a 200 status code if there is no error', () => {
    let tempDisciplineMock;

    return disciplineMock.create()
      .then(discipline => {
        tempDisciplineMock = discipline;
        return superagent.get(`${apiURL}/${discipline._id}`);
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(JSON.stringify(response.body.cyclists)).toEqual(JSON.stringify(tempDisciplineMock.cyclists));
      });
  });
});