const
	_         = require('lodash'),
	assert    = require('assert'),
	mixins    = require('./mixins'),
	moment    = require('moment'),
	polyclay  = require('polyclay'),
	P         = require('p-promise'),
	utilities = require('../utilities'),
	Comment   = require('./comment')
	;

var Prompt = module.exports = polyclay.Model.buildClass({
	properties: {
		id:     'string',
		board:  'string'
		poster: 'string',
	},
	enumerables: {
		status: [ 'filled', 'unfilled', 'hidden' ]
	},
	index: [ 'id', 'board' ],
	required: [ 'id', 'board', 'content' ],
	singular: 'prompt',
	plural:   'prompts',
});
polyclay.mixin(Prompt, mixins.HasContent);
polyclay.mixin(Prompt, mixins.HasTimestamps);
polyclay.mixin(Prompt, mixins.HasTags);
polyclay.persist(Prompt, 'id');

Prompt.create = function(opts)
{
	assert(opts && _.isObject(opts), 'opts must be an object');

	var prompt = new Prompt();
	prompt.update(opts);
	prompt.id = Prompt.generateID();
	prompt.created = Date.now();
	prompt.modified = prompt.created;
	prompt.status = 'unfilled';

	return prompt.save()
	.then(function()
	{
		return prompt;
	});
};

Prompt.generateID = function()
{
	var result = moment().format('YYYYMMDD') + '-';
	result += utilities.randomID(5);
	return result;
};

Prompt.fetchWithFills = function(id)
{
	var prompt;
	return Prompt.get(id)
	.then(function(r)
	{
		prompt = r;
		if (prompt)
			return prompt.fetchFills();

		return prompt;
	})
	.then(function(c)
	{
		return prompt;
	});
};

Prompt.prototype.fetchFills = function()
{
	if (this.fills)
		return P(this.fills);

	var deferred = P.defer();

	// TODO needs an implementation
	var items = [];
	deferred.resolve(items);

	return deferred.promise;
};

Prompt.cache = [];
Prompt.fetchPage = function(page, count)
{
	var deferred = P.defer();
	// TODO needs an implementation

	var items = [];
	deferred.resolve(items);

	return deferred.promise;
};
