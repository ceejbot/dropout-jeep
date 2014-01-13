var
	_         = require('lodash'),
	sanitizer = require('sanitizer'),
	Human     = require('../../lib/models/human')
	;


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
	var pattern = /\w+[ \-]*\w+/;
	var person;

	request.assert('handle', 'You must pick a handle for yourself, between 2 and 64 characters long.').len(2, 64);
	request.assert('handle', 'Your handle can\'t have punctuation or spaces in it.').isAlphanumeric();
	request.assert('email', 'You must provide your email address.').isEmail();
	request.assert('pass1', 'Your password must be at least 8 characters long. Longer is better.').len(8, 128);
	request.assert('pass2', 'Passwords do not match.').equals(request.body.pass1);

	var handle = sanitizer.sanitize(request.body.handle);
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
			_csrf:  request.csrfToken(),
			title:  'Sign up',
			page:   'signup',
			handle: handle,
			email:  email
		};
		response.render('signup', locals);
	}

	var errors = request.validationErrors();
	if (errors)
	{
		var msgs = _.map(errors, function(e) { return e.msg; }).join(' ');
		serveSignupForm(msgs);
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
