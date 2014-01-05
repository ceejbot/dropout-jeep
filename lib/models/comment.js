var
	_        = require('lodash'),
	assert   = require('assert'),
	moment   = require('moment'),
	polyclay = require('polyclay'),
	P        = require('p-promise')
	;

var Comment = module.exports = polyclay.Model.buildClass(
{
	properties:
	{
		id:       'string',
		post:     'string',
		poster:   'string',
		content:  'string',
		created:  'date',
		modified: 'date',
	},
	index: [ 'id', 'post', 'poster' ],
	required: [ 'id', 'post', 'poster', 'content' ],
	singular: 'comment',
	plural:   'comments',
});
polyclay.persist(Comment, 'id');
