var
	_        = require('lodash'),
	assert   = require('assert'),
	moment   = require('moment'),
	polyclay = require('polyclay'),
	P        = require('p-promise'),
	uuid     = require('node-uuid')
	;

var Human = module.exports = polyclay.Model.buildClass(
{
	properties:
	{
		id:          'string',
		handle:      'string',
		email:       'string',
		name:        'string',
		created:     'date',
		modified:    'date',
		apikey:      'string',
		permissions: 'number',
		status:      'number'
	},
	required: [ 'email', 'handle' ],
	singular: 'human',
	plural:   'humans',
});
polyclay.persist(Human, 'handle');

Human.create = function(opts)
{
	assert(opts && _.isObject(opts), 'opts must be an object');

	var human = new Human();
	human.update(opts);
	human.id = uuid.v4();
	human.created = Date.now;
	human.modified = human.created;

	return human.save();
};

Human.fetchByEmail = function fetchByEmail(email)
{
	var deferred = P.pending();

	Human.byEmail(email, function(err, person)
	{
		if (err) return deferred.reject(err);
		deferred.fulfill(person);
	});

	return deferred.promise;
};

Human.fetchByHandle = function fetchByHandle(handle)
{
	var deferred = P.pending();

	Human.byHandle(handle, function(err, person)
	{
		if (err) return deferred.reject(err);
		deferred.fulfill(person);
	});

	return deferred.promise;
};
