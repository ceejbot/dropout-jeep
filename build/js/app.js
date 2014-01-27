var
	moment = require('moment')
	;

exports.isSameDay = function isSameDay(left, right)
{
	return moment(left).isSame(right, 'day');
}
