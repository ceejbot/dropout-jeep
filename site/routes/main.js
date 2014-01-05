var
	_     = require('lodash'),
	Human = require('../../lib/models/human')
	;

exports.index = function(request, response)
{
	response.render('index', { title: 'latest', page: 'home' });
};


exports.faves = function(request, response)
{
	response.render('faves', { title: 'Favorites', page: 'faves' });
};

exports.queue = function(request, response)
{
	response.render('queue', { title: 'Queue', page: 'queue' });
};

exports.profile = function(request, response)
{
	response.render('profile', { title: 'Profile', page: 'profile' });
};
