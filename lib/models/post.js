var
	_         = require('lodash'),
	assert    = require('assert'),
	marked    = require('marked'),
	moment    = require('moment'),
	polyclay  = require('polyclay'),
	P         = require('p-promise'),
	utilities = require('../utilities')
	;

/*
Post life-cycle:
initial creation
-> draft, one last review before queueing
-> queued for posting
-> posted to front page with throttle (no more thna 1 post per 10 minutes)
-> review by moderators if requested
-> hidden if there is a problem (link works, but does not appear on front page)

can only be edited by moderators after posting
*/

var Post = module.exports = polyclay.Model.buildClass(
{
	properties:
	{
		id:       'string',
		poster:   'string',
		title:    'string',
		content:  'string',
		tags:     'array',
		created:  'date',
		modified: 'date',
	},
	enumerables:
	{
		status: [ 'draft', 'queued', 'posted', 'review', 'hidden' ]
	},
	index: [ 'id', 'poster' ],
	required: [ 'id', 'poster', 'title', 'content' ],
	singular: 'post',
	plural:   'posts',
});
polyclay.persist(Post, 'id');

Post.create = function(opts)
{
	assert(opts && _.isObject(opts), 'opts must be an object');

	var post = new Post();
	post.update(opts);
	post.id = utilities.randomID(8);
	post.created = Date.now();
	post.modified = post.created;
	post.status = 'draft';

	return post.save()
	.then(function()
	{
		return post;
	});
};

Post.prototype.createdRel = function()
{
	return moment(this.created).fromNow();
};

Post.prototype.queue = function()
{
	// TODO add post to queue
	// update its status, save
};

Post.prototype.render = function()
{
	return marked(this.content);
};
