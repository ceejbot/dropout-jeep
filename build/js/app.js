// vim: tabstop=4 softtabstop=4 shiftwidth=4 noexpandtab

var
	Backbone = require('backbone')
	;


var PostModel = exports.PostModel =  Backbone.Model.extend(
{
	// TODO
});

var PostPreview = Backbone.View.extend(
{
	tagName: "preview",
	className: "document-row",
	events:
	{
		"click .icon":          "open",
		"click .button.edit":   "openEditDialog",
		"click .button.delete": "destroy"
	},

	initialize: function()
	{
		this.listenTo(this.model, "change", this.render);
	},

	render: function()
	{
	}

});

var Postmonger = exports.Postmonger = Backbone.Router.extend(
{
	routes:
	{
		"help":                 "help",    // #help
		"search/:query":        "search",  // #search/kiwis
		"search/:query/p:page": "search"   // #search/kiwis/p7
	},
	help: function()
	{
	},
	search: function(query, page)
	{
	}
});
