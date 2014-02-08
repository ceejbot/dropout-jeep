var
	_                    = require('lodash'),
	assert               = require('assert'),
	GraphRelation        = require('./graph'),
	InvitationController = require('./controllers/invitations'),
	LevelupAdapter       = require('polyclay-levelup'),
	models               = require('./models'),
	P                    = require('p-promise'),
	path                 = require('path')
	;

// This goes away if data services are ever separated from the web server. Probably.

var MAX_INVITES = 20;

var Controller = module.exports = function Controller(config)
{
	var self = this;

	this.config = config;
	this.logger = require('../lib/logging')(config.logging);

	this.favorites = new GraphRelation(
	{
		dbpath:   path.join(config.db, 'favorites'),
		subject:  models.Human,
		object:   models.Post,
		relation: 'fave'
	});
	this.logger.info('favorites storage set in levelup graph db');

	this.models = {};

	_.each(models, function(Model, k)
	{
		Model.setStorage({ dbpath: path.join(config.db, Model.prototype.plural)}, LevelupAdapter);
		self.logger.info(k + ' storage set in levelup');
		self.models[k] = Model;
	});

	this.invitations = new InvitationController({ dbpath: path.join(config.db, 'invite-graph'), logger: this.logger });
};

Controller.prototype.logger    = null;
Controller.prototype.favorites = null;
Controller.prototype.models    = null;
