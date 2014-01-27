var
	_      = require('lodash'),
	models = require('../../lib/models'),
	moment = require('moment'),
	Human  = models.Human,
	Post   = models.Post
	;

exports.listing = function(request, response)
{
	var day = moment(request.params[0]);

	Post.fetchDay(day)
	.then(function(posts)
	{
		response.render('day',
		{
			title: moment(day).format('LL'),
			day: moment(day).format('dddd, D MMMM YYYY'),
			page: 'home', posts: posts
		});
	})
	.fail(function(err)
	{
		response.locals.flash.error.push(err.message);
		response.render('index', { title: 'latest', page: 'home', posts: [] });
	}).done();
};
