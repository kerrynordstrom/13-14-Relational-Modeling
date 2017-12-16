'use strict';

const faker = require('faker');
const Discipline = require('../../model/discipline');

const disciplineMock = module.exports = {};

disciplineMock.create = () => {
  return new Discipline({
    name: faker.lorem.words(1),
    tags: faker.lorem.words(3).split(' '),
  }).save()
    .catch(console.log);
};

disciplineMock.createMany = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map( () => disciplineMock.create()));
};


disciplineMock.remove = () => Discipline.remove ({});