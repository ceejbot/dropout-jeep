const
	downsize = require('downsize'),
	marked   = require('supermarked'),
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
		createdTime: function createdFull() { return moment(this.created).format('HH:mm a'); },
		modifiedRel: function modifiedRel() { return moment(this.modified).calendar(); },
	},
	statics:
	{
		comparator: function comparator(left, right) { return left.created.getTime() - right.created.getTime(); },
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
		render: function render() { return marked(this.content, { langPrefix: 'hljs ', breaks: true }); },
		excerpt: function excerpt()
		{
			var text = this.content.replace(/\n|\r\n|<p>|<br>/, ' ');
			return downsize(marked(text, { langPrefix: 'hljs ', breaks: false }), { words: 50, append: "…"});
		}
	}
};
