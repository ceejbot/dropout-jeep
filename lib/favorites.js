/*
Use levelgraph to store relations.

person -> favorite -> post

*/


var
	_          = require('lodash'),
	levelgraph = require('levelgraph'),
	models     = require('./models'),
	P          = require('p-promise'),
	util       = require('util')
	;


var FavoritesController = module.exports = function FavoritesController(opts)
{
	this.options = opts;

	this.db = levelgraph('./db/favorites'); // TODO
};

FavoritesController.prototype.db = null;


FavoritesController.prototype.add = function add(person, item)
{
	var self = this,
		deferred = P.defer();

	var triple = { subject: person.key, predicate: 'fave', object: item.key };
	this.db.put(triple, function(err)
	{
		if (err)
			deferred.reject(err);
		else
			deferred.resolve();
	});

	return deferred.promise;
};

FavoritesController.prototype.remove = function add(person, item)
{
	var self = this,
		deferred = P.defer();

	var triple = { subject: person.key, predicate: 'fave', object: item.key };
	this.db.del(triple, function(err)
	{
		if (err)
			deferred.reject(err);
		else
			deferred.resolve();
	});

	return deferred.promise;
};

FavoritesController.prototype.favorites = function favorites(person)
{
	var self = this,
		deferred = P.defer();

	this.db.get({ subject: person.key, predicate: 'fave' }, function(err, list)
	{
		if (err)
			return deferred.reject(err);

		var keys = _.map(list, function(i)
		{
			return i.object;
		});

		models.Post.get(keys)
		.then(function(posts)
		{
			deferred.resolve(posts);
		})
		.fail(function(err)
		{
			deferred.reject(err);
		}).done();
	});

	return deferred.promise;
};

FavoritesController.prototype.hasAsFavorite = function favorites(item)
{
	var self = this,
		deferred = P.defer();

	this.db.get({ object: item.key, predicate: 'fave' }, function(err, list)
	{
		if (err)
			return deferred.reject(err);

		var keys = _.map(list, function(i)
		{
			return i.subject;
		});

		models.Human.get(keys)
		.then(function(people)
		{
			deferred.resolve(people);
		})
		.fail(function(err)
		{
			deferred.reject(err);
		}).done();
	});

	return deferred.promise;
};
