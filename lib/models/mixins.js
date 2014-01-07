var
	downsize = require('downsize'),
	marked   = require('marked'),
	moment   = require('moment')
	;


var HasTimestamps = exports.HasTimestamps =
{
	properties:
	{
		created: 'date',
		modified: 'date'
	},
	methods:
	{
		touch: function touch() { this.modified = Date.now(); },
		createdRel: function createdRel() { return moment(this.created).calendar(); },
		modifiedRel: function modifiedRel() { return moment(this.modified).calendar(); }
	}
};

var HasContent = exports.HasContent =
{
	properties:
	{
		content: 'string'
	},
	methods:
	{
		render: function render() { return marked(this.content); },
		excerpt: function excerpt()
		{
			var text = this.content.replace(/\n|\r\n|<p>|<br>/, ' ');
			return downsize(marked(text), { words: 50, append: "…"});
		}
	}
};
