var
	moment = require('moment')
	;


var addHelpers = module.exports = function addHelpers(app)
{

	app.locals.isSameDay = function isSameDay(left, right)
	{
		return moment(left).isSame(right, 'day');
	}

	app.locals.moment = moment;

};
