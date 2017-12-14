'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const cyclistMock = require('./lib/cyclist-mock');
const disciplineMock = require('./lib/discipline-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/disciplines`;

describe('api/disciplines', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(disciplineMock.remove);

	describe('POST /disciplines', () => {
		test.only('POST - should respond with a bicycle and 200 status code if there is no error', () => {
			return superagent.post(`${apiURL}`)
				.send()
				.then(response => {
					expect(response.status).toEqual(200);
					expect(response.body._id).toBeTruthy();
					expect(response.body.timestamp).toBeTruthy();
					expect(response.body.eventsEntered).toBeTruthy();
					expect(response.body.name).toEqual(cyclistToPost.name);
					expect(response.body.age).toEqual(cyclistToPost.age);
					expect(response.body.discipline).toEqual(cyclistToPost.mock._id.toString());
				})
				.catch(error => logger.log(error));
		});

//     test('POST - should respond with a 400 status code if the bicycle is incomplete', () => {
//       let cyclistToPost = {
//         Cyclist: 'Lars Boom',
//         Discipline: 'Track',
//       };
//       return superagent.post(`${apiURL}`)
//         .send(cyclistToPost)
//         .then(Promise.reject)
//         .catch(response => {
//           expect(response.status).toEqual(400);
//         });
//     });
//   });


//   describe('GET /api/bicycles', () => {
//     test('GET - should respond with a 200 status code if there is no error', () => {
//       let cyclistToTest = null;

//       return cyclistMockCreate()
//         .then(cyclist => {
//           //may want to add error checking after this success test
//           cyclistToTest = cyclist;
//           return superagent.get(`${apiURL}/${cyclist._id}`);
//         })
//         .then(response => {
//           expect(response.status).toEqual(200);
//           expect(response.body._id).toEqual(cyclistToTest._id.toString());
//           expect(response.body.timestamp).toBeTruthy();
//           expect(response.body.name).toEqual(cyclistToTest.name);
//           expect(response.body.age).toEqual(cyclistToTest.age);
//           expect(response.body.discipline).toEqual(cyclistToTest.discipline);
//         })
//         .catch(error => logger.log(error));
//     });
//     test('GET - should respond with a 200 status code if there is no error', () => {
//       return cyclistMockCreate()
//         .then(() => cyclistMockCreate2())
//         .then(() => {
//           return superagent.get(`${apiURL}`);
//         })
//         .then(response => {
//           expect(response.status).toEqual(200);
//           expect(response.body.length).toEqual(2);
//         })
//         .catch(error => logger.log(error));
//     });
//     test('GET - should respond with a 404 status code if the id is incorrect', () => {
//       return superagent.get(`${apiURL}/nonsenseISay`)
//         .then(Promise.reject)
//         .catch(response => {
//           expect(response.status).toEqual(404);
//         });
//     });
//   });

//   describe('PUT /api/bicycles', () => {
//     test('PUT - should respond with a 200 status code if there is no error', () => {
//       let cyclistToTest = null;

//       return cyclistMockCreate()
//         .then(cyclist => {
//           cyclistToTest = cyclist;
//           return superagent.put(`${apiURL}/${cyclist._id}`)
//             .send({ discipline: 'Cyclocross' });
//         })
//         .then(response => {
//           expect(response.status).toEqual(200);
//           expect(response.body._id).toEqual(cyclistToTest._id.toString());
//           expect(response.body.timestamp).toBeTruthy();
//           expect(response.body.name).toEqual('Cyclocross');
//           expect(response.body.age).toEqual(cyclistToTest.age);
//           expect(response.body.discipline).toEqual(cyclistToTest.discipline);
//         })
//         .catch(error => logger.log(error));
//     });
//   });

//   describe('DELETE /api/bicycles/:id', () => {
//     test('DELETE - should respond with no body and a 204 status code if there is no error', () => {
//       return cyclistMockCreate()
//         .then(cyclist => {
//           return superagent.delete(`${apiURL}/${cyclist._id}`);
//         })
//         .then(response => {
//           expect(response.status).toEqual(204);
//         });
//     });

//     test('DELETE - should respond with a 404 status code if the id is incorrect', () => {
//       return superagent.delete(`${apiURL}/`)
//         .then(Promise.reject)
//         .catch(response => {
//           expect(response.status).toEqual(404);
//         });
//     });
//   });
// });