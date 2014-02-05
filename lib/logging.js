const
	bunyan = require('bunyan'),
	fs     = require('fs'),
	path   = require('path')
	;

var logger;

var createLogger = module.exports = function createLogger(opts)
{
	if (logger) return logger;

	var logopts =
	{
		name: 'jeep',
		serializers: bunyan.stdSerializers,
		streams: [ ]
	};

	if (opts.path)
	{
		if (!fs.existsSync(opts.path))
			fs.mkdirSync(opts.path);

		var fname = path.join(opts.path, 'jeep' + '.log');
		logopts.streams.push({ level: 'info', path: fname, });
	}

	if (opts.console)
		logopts.streams.push({level: 'debug', stream: process.stdout});

	exports.logger = bunyan.createLogger(logopts);
	return exports.logger;
};
