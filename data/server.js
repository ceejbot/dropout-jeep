var
	_       = require('lodash'),
	assert  = require('assert'),
	domain  = require('domain'),
	http    = require('http'),
	P       = require('p-promise'),
	restify = require('restify'),
	uuid    = require('node-uuid')
	;

// restful API to each kind of model
// get, put, post, del, patch
// database storage for each model
// redis caching layer in front of it

exports.createServer = function createServer(opts)
{
	assert(opts && _.isObject(opts), 'you must pass an options object');

	var server = restify.createServer(opts);

	server.use(domainWrapper);
	server.use(restify.requestLogger());
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(logEachRequest);
	server.use(restify.conditionalRequest());

	server.get('/ping', ping);
	server.get('/health', health);

	server.get('/humans/', humansAll);
	server.get('/humans/:id', human);
	server.post('/humans/', humanPost);
	server.put('/humans/:id', humanPut);
	server.patch('/humans/:id', humanPatch);
	server.del('/humans/:id', humanDel);

	server.get('/posts/', postsAll);
	server.get('/posts/:id', post);
	server.post('/posts/', postPost);
	server.put('/posts/:id', postPut);
	server.patch('/posts/:id', postPatch);
	server.del('/posts/:id', postDel);

	server.get('/posts/:pid/comments/', commentsAll);
	server.get('/posts/:pid/comments/:id', comment);
	server.post('/posts/:pid/comments/', commentPost);
	server.put('//posts/:pid/comments/:id', commentPut);
	server.patch('/posts/:pid/comments/:id', commentPatch);
	server.del('/posts/:pid/comments/:id', commentDel);

	return server;
};

function domainWrapper(request, response, next)
{
	var d = domain.create();
	d.on('error', function(err)
	{
		request.log.error(err);
	});
	d.run(next);
}

function logEachRequest(request, response, next)
{
	request.log.info(request.method, request.url);
	next();
}

//----------------------------------------------------------

function ping(request, response, next)
{
	response.send(200, { status: 'OK' });
	next();
}

function health(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

//----------------------------------------------------------

function humansAll(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function human(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function humanPost(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function humanPut(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function humanPatch(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function humanDel(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

//----------------------------------------------------------

function postsAll(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function post(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function postPost(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function postPut(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function postPatch(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function postDel(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

//----------------------------------------------------------

function commentsAll(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function comment(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function commentPost(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function commentPut(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function commentPatch(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

function commentDel(request, response, next)
{
	response.send(200, 'unimplemented');
	next();
}

//----------------------------------------------------------

var server = exports.createServer({ name: 'dropout-jeep-data' });
server.listen(3001, function()
{
	console.log('%s listening at %s', server.name, server.url);
});
