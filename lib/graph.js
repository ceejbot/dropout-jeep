var
	_          = require('lodash'),
	assert     = require('assert'),
	levelgraph = require('levelgraph'),
	P          = require('p-promise'),
	util       = require('util')
	;

var GraphRelation = module.exports = function GraphRelation(opts)
{
	assert(opts && _.isObject(opts), 'you must pass an options object');
	assert(opts.dbpath || opts.db, 'you must pass either a db option or a dbpath string');
	assert(opts.relation && _.isString(opts.relation, 'you must pass a relation string'));
	assert(opts.subject && _.isFunction(opts.subject, 'you must pass a subject constructor function'));
	assert(opts.object && _.isFunction(opts.object, 'you must pass an object constructor function'));

	this.options  = opts;

	if (opts.dbpath)
		this.db = levelgraph(opts.dbpath);
	else
		this.db = opts.db;

	this.relation = opts.relation;
	this.subject  = opts.subject;
	this.object   = opts.object;
};

GraphRelation.prototype.db       = null;
GraphRelation.prototype.relation = null;
GraphRelation.prototype.subject  = null;
GraphRelation.prototype.object   = null;

GraphRelation.prototype.add = function add(subject, object)
{
	var self = this,
		deferred = P.defer();

	var triple = { subject: subject.key, predicate: this.relation, object: object.key };
	this.db.put(triple, function(err)
	{
		if (err)
			deferred.reject(err);
		else
			deferred.resolve();
	});

	return deferred.promise;
};

GraphRelation.prototype.remove = function add(subject, object)
{
	var self = this,
		deferred = P.defer();

	var triple = { subject: subject.key, predicate: this.relation, object: object.key };
	this.db.del(triple, function(err)
	{
		if (err)
			deferred.reject(err);
		else
			deferred.resolve();
	});

	return deferred.promise;
};

GraphRelation.prototype.relationsFor = function favorites(subject)
{
	var self = this,
		deferred = P.defer();

	this.db.get({ subject: subject.key, predicate: this.relation }, function(err, list)
	{
		if (err)
			return deferred.reject(err);

		var keys = _.map(list, function(i)
		{
			return i.object;
		});

		self.object.get(keys)
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

GraphRelation.prototype.hasAsRelation = function favorites(object)
{
	var self = this,
		deferred = P.defer();

	this.db.get({ object: object.key, predicate: this.relation }, function(err, list)
	{
		if (err)
			return deferred.reject(err);

		var keys = _.map(list, function(i)
		{
			return i.subject;
		});

		self.subject.get(keys)
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
