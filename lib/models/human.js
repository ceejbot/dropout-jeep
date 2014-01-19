var
	_        = require('lodash'),
	assert   = require('assert'),
	crypto   = require('crypto'),
	marked   = require('marked'),
	mixins   = require('./mixins'),
	moment   = require('moment'),
	polyclay = require('polyclay'),
	P        = require('p-promise'),
	scrypt   = require('scrypt-hash'),
	uuid     = require('node-uuid')
	;

var Human = module.exports = polyclay.Model.buildClass(
{
	properties:
	{
		id:          'string',
		handle:      'string',
		email:       'string',
		apikey:      'string',
		permissions: 'number',
		profile:     'string',
		_hashed:     'string',
	},
	enumerables:
	{
		standing: ['good', 'pending', 'unpaid', 'suspended', 'hellbanned', 'banned']
	},
	required: [ 'id', 'email', 'handle', '_hashed' ],
	index: [ 'id', 'email', 'handle' ], // secondary indexes
	singular: 'human',
	plural:   'humans',
});

polyclay.mixin(Human, mixins.HasTimestamps);
polyclay.persist(Human, 'handle');

Human.create = function(opts)
{
	assert(opts && _.isObject(opts), 'opts must be an object');

	var human = new Human();
	human.update(opts);
	human.id = uuid.v4();
	human.created = Date.now();
	human.modified = human.created;

	return human.save()
	.then(function()
	{
		return human;
	});
};

Human.fetchByEmail = function(email)
{
	var deferred = P.defer();

	Human.byEmail(email, function(err, person)
	{
		if (err) return deferred.reject(err);
		deferred.resolve(person);
	});

	return deferred.promise;
};

Human.fetchByHandle = function(handle)
{
	var deferred = P.defer();

	Human.byHandle(handle, function(err, person)
	{
		if (err) return deferred.reject(err);
		deferred.resolve(person);
	});

	return deferred.promise;
};

Human.validateLogin = function(identity, password)
{
	var deferred = P.defer();

	Human.find(identity, function(err, person)
	{
		if (err)
		{
			if (err.message == 'Key not found in any of the indexes.')
				return deferred.resolve(null);
			return deferred.reject(err);
		}
		if (!person) return deferred.resolve(null);

		var pieces = person._hashed.split('$');
		if (pieces.length !== 2)
		{
			// bad format; log it!
			deferred.resolve(null);
		}

		var salt = new Buffer(pieces[0], 'hex');

		hasher(new Buffer(password), salt)
		.then(function(candidate)
		{
			if (candidate === person._hashed)
				deferred.resolve(person);
			else
				deferred.resolve(null);
		})
		.fail(function(err)
		{
			deferred.reject(err);
		}).done();
	});

	return deferred.promise;
};

function hasher(value, salt)
{
	var deferred = P.defer();

	var N = 1024 * 64;
	var r = 8;
	var p = 1;
	var len = 32;

	scrypt(value, salt, N, r, p, len, function(err, hash)
	{
		if (err) return deferred.reject(err);
		deferred.resolve(salt.toString('hex') + '$' + hash.toString('hex'));
	});

	return deferred.promise;
}

Human.prototype.setPassword = function(newpass)
{
	var self = this;

	self._hashed = null;
	var salt = crypto.randomBytes(16);

	return hasher(new Buffer(newpass), salt)
	.then(function(hash)
	{
		self._hashed = hash;
		return self.save();
	});
};

function hashEmail(input)
{
	var hasher = crypto.createHash('md5');
	hasher.update(input.toLowerCase());
	return hasher.digest('hex');
}

Human.prototype.gravatarURL = function(size)
{
	size = size || 150;
	var hash = hashEmail(this.email);
	var gravatar = 'http://www.gravatar.com/avatar/' + hash + '?s=' + size;
	return gravatar;
};

Human.prototype.rendered = function()
{
	if (this.profile.length)
		return marked(this.profile);
	else
		return 'No profile provided';
};
