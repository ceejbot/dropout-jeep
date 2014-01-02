var
	_        = require('lodash'),
	assert   = require('assert'),
	moment   = require('moment'),
	polyclay = require('polyclay'),
	P        = require('p-promise'),
	;

var Post = module.exports = polyclay.Model.buildClass(
{
	properties:
	{
		id:       'string',
		poster:   'string',
		title:    'string',
		content:  'string',
		created:  'date',
		modified: 'date',
	},
	required: [ 'id', 'poster', 'content', 'title' ],
	singular: 'post',
	plural:   'posts',
});
polyclay.persist(Post, 'id');
