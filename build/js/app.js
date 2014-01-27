var
	marked = require('supermarked'),
	moment = require('moment'),
	stapes = require('stapes')
	;

exports.isSameDay = function isSameDay(left, right)
{
	return moment(left).isSame(right, 'day');
};

exports.renderMarkdown = function renderMarkdown(input)
{
	return marked(input, { langPrefix: 'hljs ', breaks: true });
};
