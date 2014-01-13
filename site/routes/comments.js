var
	_         = require('lodash'),
	models    = require('../../lib/models'),
	P         = require('p-promise'),
	sanitizer = require('sanitizer'),
	Comment   = models.Comment
	;

exports.commentPost = function(request, response)
{
	var poster = request.user,
		comment;

	// TODO check permissions of logged-in user

	request.assert('content', 'required').notEmpty();

	var details =
	{
		poster:  poster.handle,
		post:  request.params.pid,
		content: sanitizer.sanitize(request.body.content),
	};

	var errors = request.validationErrors();
	if (errors)
	{
		// TODO preserve the comment in the destination page, probably in session storage
		request.flash('error', errors.join(' '));
		request.redirect('/post/' + request.params.pid);
		return;
	}

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
		response.redirect('/post/' + request.params.pid);
	}).done();
};

exports.commentEdit = function(request, response)
{

};

exports.commentEditPost = function(request, response)
{

};

