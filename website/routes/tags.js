

exports.all = function(request, response)
{
	response.render('unimplemented', { title: 'Tags', page: 'latest' });
};

exports.tag = function(request, response)
{
	response.render('unimplemented', { title: request.params.tag, page: 'latest' });
};
