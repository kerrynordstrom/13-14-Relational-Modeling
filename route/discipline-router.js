'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');

const jsonParser = require('body-parser').json();
const Discipline = require('../model/discipline');

const discipineRouter = module.exports = new Router();

disciplineRouter.post('/api/disciplines', jsonParser, (request, response, next) => {
	if(!request.body.name) 
		return next(httpErrors(400, 'Discipline requires a name.'));
	
	return new Discipline(request.body).save()
		.then(discipline => response.json(discipline))
		.catch(next);
)};

disciplineRouter.put('/api/disciplines', jsonParser, (request, response, next) => {
	let options = {new: true, runValidators: true};

	return Disciplines.findByIdAndUpdate(request.params.id, request.body, options)
		.then(discipline => {
			if(!discipline)
				throw httpErrors(404, 'Discipline not found');
				return response.json(category);
		})
		.catch(next);
});

disciplineRouter.get('/api/disciplines/:id', (request, response, next) => {
	return Discipline.findById(request.params.id)
		.then(discipline => {
			if(!discipline)
				throw httpErrors(404, 'Discipline not found');
			return response.json(category);
		})
		.catch(next);
});

disciplineRouter.delete('/api/disciplines/:id', (request, response, next) => {
	return Discipline.findByIdAndRemove(request.params.id)
		.then(discipline => {
			if (!discipline)
				throw httpErrors(404, 'Discipline not found');
			return response.json(category);
		})
		.catch(next);
});