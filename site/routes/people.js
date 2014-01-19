var
	_         = require('lodash'),
	models    = require('../../lib/models'),
	P         = require('p-promise'),
	sanitizer = require('sanitizer'),
	Human     = models.Human
	;


exports.profile = function(request, response)
{
	var handle = sanitizer.sanitize(request.params.id);

	Human.get(handle)
	.then(function(person)
	{
		if (!person)
		{
			request.flash('warn', 'We\'ve never heard of ' + handle);
			response.redirect('/');
		}

		var locals =
		{
			title: 'profile',
			page: person.handle,
			person: person
		}

		response.render('profile', locals);
	})
	.fail(function(err)
	{
		request.flash('error', err.message);
		response.redirect('/');
	}).done();

};

exports.editProfile = function(request, response)
{
	var locals =
	{
		title: 'profile',
		page: 'edit your profile',
		person: request.user
	};

	response.render('profile', { title: 'profile', page: 'profile-edit' });
};

exports.postEditProfile = function(request, response)
{

};
