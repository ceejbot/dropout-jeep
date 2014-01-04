exports.post = function(request, response)
{
	var locals =
	{
		_csrf: request.csrfToken(),
		title: 'New post',
		page: 'post'
	};

	response.render('post', locals);
};

exports.postPost = function(request, response)
{
	request.flash('info', 'unimplemented');
	response.redirect('/');
};

