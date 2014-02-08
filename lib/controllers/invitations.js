var
	_             = require('lodash'),
	assert        = require('assert'),
	GraphRelation = require('../graph'),
	levelgraph    = require('levelgraph'),
	models        = require('../models'),
	uuid          = require('node-uuid')
	;

var InvitationController = module.exports = function InvitationController(config)
{
	this.db = levelgraph(config.dbpath);
	this.logger = config.logger;

	this.invitedGraph = new GraphRelation(
	{
		db:       this.db,
		subject:  models.Human,
		object:   models.Human,
		relation: 'invited'
	});

	this.creatorGraph = new GraphRelation(
	{
		db:       this.db,
		subject:  models.Human,
		object:   models.Invitation,
		relation: 'created'
	});

	this.logger.info('invitations graph db: ' + config.dbpath);
};

InvitationController.prototype.logger       = null;
InvitationController.prototype.db           = null;
InvitationController.prototype.invitedGraph = null;
InvitationController.prototype.creatorGraph = null;

InvitationController.prototype.isValid = function isValid(key)
{
	return models.Invitation.get(key)
	.then(function(invite)
	{
		if (!invite)
			return { msg: 'Invitation not found', invitation: null };
		if (!invite.isValid())
			return { msg: 'That invitation code has already been used.', invitation: null };

		return { msg: null, invitation: invite };
	});
};

InvitationController.prototype.generate = function generate(creator)
{
	assert(creator);
	var self = this;

	var invitation = new models.Invitation();
	invitation.key = uuid.v4();
	invitation.creator = creator;

	return invitation.save()
	.then(function(result)
	{
		return self.creatorGraph.add(creator, invitation);
	})
	.then(function()
	{
		self.logger.info({ invitation: invitation.key, creator: creator.key },
			'invitation generated');
		return invitation;
	});
};

InvitationController.prototype.consume = function consume(invitation, consumer)
{
	var self = this;

	return invitation.consume(consumer)
	.then(function(result)
	{
		return self.invitedGraph.add(invitation.creator, consumer);
	})
	.then(function()
	{
		self.logger.info(
		{
			invitation: invitation.key,
			creator: invitation.creator.key,
			consumer: consumer.key
		}, 'invitation consumed');
		return invitation;
	});
};

InvitationController.prototype.allInvitationsFor = function allInvitationsFor(human)
{
	return this.creatorGraph.relationsFor(human);
};

InvitationController.prototype.unusedInvitations = function unusedInvitations(human)
{
	return this.allInvitationsFor(human)
	.then(function(invitations)
	{
		return _.filter(invitations, function(i) { return !i.consumed; });
	});
};

InvitationController.prototype.invitees = function invitees(human)
{
	return this.invitedGraph.relationsFor(human);
};

InvitationController.prototype.wasInvitedBy = function wasInvitedBy(human)
{
	return this.invitedGraph.hasAsRelation(human)
	.then(function(invitees)
	{
		// this array *should* have only one member!
		if (!invitees || !invitees.length)
			return null;
		return invitees[0];
	});
};
