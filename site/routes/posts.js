var
	_         = require('lodash'),
	models    = require('../../lib/models'),
	P         = require('p-promise'),
	sanitizer = require('sanitizer'),
	Post      = models.Post
	;

exports.post = function(request, response)
{
	Post.fetchWithComments(request.params.id)
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

	request.assert('title', 'You must include a title.').notEmpty();
	request.assert('content', 'You must include a post body!').notEmpty();
	request.assert('tags', 'You need to pick some tags.').notEmpty();

	var details =
	{
		poster: poster.handle,
		title: sanitizer.sanitize(request.body.title).trim(),
		content: sanitizer.sanitize(request.body.content).trim(),
		tags: request.body.tags.split(',').map(function(i) { return i.trim(); })
	};

	// TODO
	// make sure post has at least one link in it
	// tag validation

	function rerenderPage(msg)
	{
		if (!response.locals.flash.error)
			response.locals.flash.error = [];
		response.locals.flash.error.push(msg);
		var locals =
		{
			_csrf: request.csrfToken(),
			title: 'New post',
			page: 'post',
			post:
			{
				title: details.title,
				content: details.content,
				tags: details.tags.join(', ')
			}
		};
		response.render('post-edit', locals);
	}

	var errors = request.validationErrors();
	if (errors)
	{
		var msgs = _.map(errors, function(e) { return e.msg; });
		rerenderPage(msgs);
		return;
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
		rerenderPage(err.message);
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
			request.flash('warning', 'You cannot edit a post you did not make.');
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
	var post;

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
			request.flash('warning', 'You cannot edit a post you did not make.');
			response.redirect('/');
			return;
		}

		request.assert('title', 'You must include a title.').notEmpty();
		request.assert('content', 'You must include a post body!').notEmpty();
		request.assert('tags', 'You need to pick some tags.').notEmpty();

		var details =
		{
			title: sanitizer.sanitize(request.body.title).trim(),
			content: sanitizer.sanitize(request.body.content).trim(),
			tags: request.body.tags.split(',').map(function(i) { return i.trim(); })
		};

		function rerenderPage(msg)
		{
			if (!response.locals.flash.error)
				response.locals.flash.error = [];
			response.locals.flash.error.push(msg);
			var locals =
			{
				_csrf: request.csrfToken(),
				title: post.title,
				page: 'post',
				post:
				{
					title: details.title,
					content: details.content,
					tags: details.tags.join(', ')
				}
			};
			response.render('post-edit', locals);
		}

		var errors = request.validationErrors();
		if (errors)
		{
			var msgs = _.map(errors, function(e) { return e.msg; });
			rerenderPage(msgs);
			return;
		}

		post.update(details);
		post.save()
		.then(function()
		{
			request.flash('success', 'Post updated.');
			response.redirect('/post/' + post.id);
		})
		.fail(function(err)
		{
			rerenderPage(err.message);
		}).done();
	})
	.fail(function(err)
	{
		request.flash('error', err.message);
		response.redirect('/');
	}).done();
};

