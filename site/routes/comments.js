var
	_       = require('lodash'),
	models  = require('../../lib/models'),
	P       = require('p-promise'),
	Comment = models.Comment
	;

exports.commentPost = function(request, response)
{
	var poster = request.user,
		comment;

	// check permissions of logged-in user

	var details =
	{
		poster:  poster.handle,
		post:  request.params.pid,
		content: request.body.content,
	};

	// validate

	Comment.create(details)
	.then(function(comment)
	{
		request.app.logger.info('comment added; post=' + details.post + ' comment=' + comment.id);
		request.flash('success', 'Comment posted.');
		response.redirect('/post/' + request.params.pid);
	})
	.fail(function(err)
	{
		request.flash('warning', err.message);
		response.redirect('/post/' + request.params.pid)
	}).done();
};

exports.commentEdit = function(request, response)
{

};

exports.commentEditPost = function(request, response)
{

};

