var
	_             = require('lodash'),
	assert        = require('assert'),
	events        = require('events'),
	GraphRelation = require('../graph'),
	Human         = require('./human'),
	levelgraph    = require('levelgraph'),
	mixins        = require('./mixins'),
	polyclay      = require('polyclay'),
	util          = require('util'),
	uuid          = require('node-uuid')
	;

var Invitation = module.exports = polyclay.Model.buildClass(
{
	properties:
	{
		id:       'string',
		version:  'number',
		creator:  'reference',
		consumer: 'reference',
		consumed: 'boolean',
	},
	required:   [ 'creator_id', 'created', ],
	singular:   'invitation',
	plural:     'invitations',
	initialize: function()
	{
		this.created  = Date.now();
		this.consumed = false;
		this.version  = 1;
	},
});

polyclay.mixin(Invitation, mixins.HasTimestamps);
polyclay.persist(Invitation, 'id');

Invitation.prototype.isValid = function isValid()
{
	return !this.consumed;
};

Invitation.prototype.consume = function consume(consumer)
{
	this.consumed = true;
	this.consumer = consumer;
	this.modified = Date.now();
	return this.save();
};
