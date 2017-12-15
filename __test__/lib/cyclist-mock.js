'use strict';

const faker = require('faker');
const disciplineMock = require('./discipline-mock');
const Cyclist = require('../../model/cyclist');

const cyclistMock = module.exports = {};

cyclistMock.create = () => {
  let mock = {};

  return disciplineMock.create()
    .then(discipline => {
      mock.discipline = discipline;

      return new Cyclist({
        name: faker.name.firstName(2),
        age: faker.random.number(65),
        eventsEntered: faker.random.number(55),
        discipline: discipline._id,
      }).save();
    })
    .then(cyclist => {
      mock.cyclist = cyclist;
      return mock;
    });
};

cyclistMock.createMany = (howMany) => {
  let mock = {};

  return disciplineMock.create()
    .then(discipline => {
      mock.discipline = discipline;
      return Promise.all(new Array (howMany)
        .fill(0)
        .map(() => {
          return new Cyclist({
            name: faker.lorem.words(2),
            age: faker.random.number(1),
            eventsEntered: faker.random.number(1),
            discipline: discipline._id,
          }).save();
        }));
    })
    .then(cyclists => {
      mock.cyclists = cyclists;
      return mock;
    });
};

cyclistMock.remove = () => Promise.all([
  Cyclist.remove({}),
  disciplineMock.remove(),

]);