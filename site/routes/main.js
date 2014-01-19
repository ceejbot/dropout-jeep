var
	_      = require('lodash'),
	models = require('../../lib/models'),
	Human  = models.Human,
	Post   = models.Post
	;

exports.index = function(request, response)
{
	Post.fetchPage(0, 20)
	.then(function(posts)
	{
		response.render('index', { title: 'latest', page: 'home', posts: posts });
	})
	.fail(function(err)
	{
		response.locals.flash.error.push(err.message);
		response.render('index', { title: 'latest', page: 'home', posts: [] });
	}).done();
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

