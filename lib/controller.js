var
	_       = require('lodash'),
	assert  = require('assert'),
	bole    = require('bole'),
	Rethink = require('polyclay-rethink'),
	models  = require('./models'),
	P       = require('p-promise'),
	path    = require('path')
	;

// This goes away if data services are ever separated from the web server. Probably.

var Controller = module.exports = function Controller(config)
{
	var self = this;

	this.config = config;
	this.logger = bole('controller');
	var logout = process.stdout;
	if (process.env.NODE_ENV && process.env.NODE_ENV.match(/^dev/))
	{
		logout = require('bistre')({time: true});
		logout.pipe(process.stdout);
	}
	bole.output({ level: process.env.LOGLEVEL, stream: logout });

	this.models = {};
	var dbopts =  {
		host:     process.env.RETHINK_HOST,
		port:     process.env.RETHINK_PORT,
		database: process.env.RETHINK_DB,
	};


	_.each(models, function(Model, k)
	{
		Model.setStorage(dbopts, Rethink);
		self.logger.info(k + ' storage set in rethinkdb');
		self.models[k] = Model;
	});
};

Controller.prototype.logger    = null;
Controller.prototype.favorites = null;
Controller.prototype.models    = null;
