var
	_         = require('lodash'),
	assert    = require('assert'),
	marked    = require('marked'),
	moment    = require('moment'),
	polyclay  = require('polyclay'),
	P         = require('p-promise'),
	utilities = require('../utilities')
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
	required: [ 'id', 'post', 'poster', 'content' ],
	singular: 'comment',
	plural:   'comments',
});
polyclay.persist(Comment, 'id');


Comment.create = function(opts)
{
	assert(opts && _.isObject(opts), 'opts must be an object');
	assert(opts.poster, 'opts.poster must be set');
	assert(opts.post, 'opts.post must be the id of the owning post');

	var comment = new Comment();
	comment.update(opts);
	comment.id = opts.post + ':' + utilities.randomID(4);
	comment.created = Date.now();
	comment.modified = comment.created;

	return comment.save()
	.then(function()
	{
		return comment;
	});
};

Comment.prototype.render = function()
{
	return marked(this.content);
}

Comment.prototype.postTimeShort = function()
{
	return moment(this.created).calendar();
}
