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

var Board = module.exports = polyclay.Model.buildClass({
	properties: {
		id:         'string',
		owner:      'string',
		title:      'string',
		moderators: 'array',
	},
	enumerables: {
		status: [ 'paid', 'unpaid', 'hidden' ]
	},
	index: [ 'id', 'owner' ],
	required: [ 'id', 'owner', 'title' ],
	singular: 'board',
	plural:   'boards',
});
polyclay.mixin(Board, mixins.HasContent);
polyclay.mixin(Board, mixins.HasTimestamps);
polyclay.persist(Board, 'id');

Board.create = function(opts)
{
	assert(opts && _.isObject(opts), 'opts must be an object');

	var board = new Board();
	board.update(opts);
	board.id = Board.generateID();
	board.created = Date.now();
	board.modified = board.created;
	board.status = 'unpaid';

	return board.save()
	.then(function()
	{
		return board;
	});
};
