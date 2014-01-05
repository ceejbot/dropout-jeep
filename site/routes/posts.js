var
	_      = require('lodash'),
	models = require('../../lib/models'),
	P      = require('p-promise'),
	Post   = models.Post
	;

exports.post = function(request, response)
{
	Post.get(request.params.id)
	.then(function(post)
	{
		if (!post)
		{
			request.flash('warning', 'Post not found');
			response.redirect('/');
			return;
		}

		var locals =
		{
			_csrf: request.csrfToken(),
			title: post.title,
			page: 'latest',
			post: post
		};

		response.render('post', locals);
	})
	.fail(function(err)
	{
		request.flash('error', err.message);
		response.redirect('/');
	}).done();
};

exports.postCreate = function(request, response)
{
	var locals =
	{
		_csrf: request.csrfToken(),
		title: 'New post',
		page: 'post',
		post: { }
	};

	response.render('post-edit', locals);
};

exports.postPost = function(request, response)
{
	var poster = request.user,
		post;

	var details =
	{
		poster: poster.handle,
		title: request.body.title,
		content: request.body.content,
		tags: request.tags.split(',').map(function(i) { return i.trim(); })
	};

	// validate

	function servePostEdit(msg)
	{
		if (!response.locals.flash.error)
			response.locals.flash.error = [];
		response.locals.flash.error.push(msg);
		var locals =
		{
			_csrf: request.csrfToken(),
			title: 'New post',
			page: 'post',
			post: details
		};
		response.render('post-edit', locals);
	}

	Post.create(details)
	.then(function(result)
	{
		post = result;
		request.flash('success', 'Post created.');
		response.redirect('/post/' + post.id);
	})
	.fail(function(err)
	{
		servePostEdit(err.message);
	}).done();
};

exports.postEdit = function(request, response)
{
	Post.get(request.params.id)
	.then(function(post)
	{
		if (!post)
		{
			request.flash('warning', 'Post not found');
			response.redirect('/');
			return;
		}

		if (post.poster !== request.user.handle)
		{
			request.app.logger.info(request.user.handle + ' attempted to edit post ' + post.id);
			request.flash('warning', 'You cannot edit a post you did not make.')
			response.redirect('/');
			return;
		}

		var locals =
		{
			_csrf: request.csrfToken(),
			title: post.title,
			page: 'post',
			post: post
		};

		response.render('post-edit', locals);
	})
	.fail(function(err)
	{
		request.flash('error', err.message);
		response.redirect('/');
	}).done();
};

exports.postEditPost = function(request, response)
{
	var post

	Post.get(request.params.id)
	.then(function(reply)
	{
		post = reply;

		if (!post)
		{
			request.flash('warning', 'Post not found');
			response.redirect('/');
			return;
		}

		if (post.poster !== request.user.handle)
		{
			request.app.logger.info(request.user.handle + ' attempted to edit post ' + post.id);
			request.flash('warning', 'You cannot edit a post you did not make.')
			response.redirect('/');
			return;
		}

		var details =
		{
			title: request.body.title,
			content: request.body.content,
			tags: request.body.tags.split(',').map(function(i) { return i.trim(); })
		};

		post.update(details);
		post.save()
		.then(function()
		{
			request.flash('success', 'Post updated.');
			response.redirect('/post/' + post.id);
		});
	})
	.fail(function(err)
	{
		request.flash('error', err.message);
		response.redirect('/');
	}).done();
};

