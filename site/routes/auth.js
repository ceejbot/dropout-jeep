var
	Human         = require('../../lib/human'),
	passport      = require('passport')
	;

exports.validateLogin  = function(identity, password, callback)
{
	Human.validateLogin(identity, password)
	.then(function(person)
	{
		callback(null, person);
	})
	.fail(function(err)
	{
		callback(err);
	}).done();
};

exports.login = function(request, response)
{
	var locals =
	{
		_csrf: request.csrfToken(),
		title: 'Sign in'
	};

	response.render('login', locals);
};

exports.loginPost = function(request, response)
{
	request.flash('success', 'Welcome back!');
	response.redirect('/');
};

exports.logout = function(request, response)
{
	request.logout();
	response.redirect('/');
};
