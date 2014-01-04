var
	_     = require('lodash'),
	Human = require('../../lib/human')
	;

exports.index = function(request, response)
{
	response.render('index', { title: 'latest', page: 'home' });
};

exports.signup = function(request, response)
{
	var locals =
	{
		_csrf: request.csrfToken(),
		title: 'Sign up',
		page: 'signup'
	};

	response.render('signup', locals);
};

exports.signupPost = function(request, response)
{
	var person;
	var handle = request.body.handle;
	var email = request.body.email;
	var pass1 = request.body.pass1;
	var pass2 = request.body.pass2;

	// check for each in use, if okay, create

	function serveSignupForm(msg)
	{
		if (!response.locals.flash.error)
			response.locals.flash.error = [];
		response.locals.flash.error.push(msg);
		var locals =
		{
			_csrf: request.csrfToken(),
			title: 'Sign up',
			page: 'signup'
		};
		response.render('signup', locals);
	}

	if (pass1 !== pass2)
	{
		serveSignupForm('Passwords do not match.');
		return;
	}

	var opts =
	{
		handle: handle,
		email:  email,
		status: 'pending',
		permissions: 1
	};

	Human.create(opts)
	.then(function(result)
	{
		person = result;
		return person.setPassword(pass1);
	})
	.then(function(reply)
	{
		request.flash('success', 'yay! now log in');
		response.redirect('/');
	})
	.fail(function(err)
	{
		serveSignupForm(err.message);
	}).done();
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
