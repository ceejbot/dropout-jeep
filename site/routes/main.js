var
	_     = require('lodash'),
	Human = require('../../lib/models/human')
	;

exports.index = function(request, response)
{
	response.render('index', { title: 'latest', page: 'home' });
};

exports.about = function(request, response)
{
	response.render('about', { title: 'about', page: 'home'} );
};

exports.faves = function(request, response)
{
	response.render('faves', { title: 'favorites', page: 'faves' });
};

exports.queue = function(request, response)
{
	response.render('queue', { title: 'queue', page: 'queue' });
};

exports.profile = function(request, response)
{
	response.render('profile', { title: 'profile', page: 'profile' });
};
