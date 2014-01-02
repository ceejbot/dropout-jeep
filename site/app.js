var
	config         = require('../config'),
	express        = require('express'),
	flash          = require('connect-flash'),
	routes         = require('./routes'),
	http           = require('http'),
	path           = require('path'),
	RedisStore     = require('connect-redis')(express),
	LevelupAdapter = require('polyclay-levelup')
	;

//-----------------------------------------------------------------
// Databases

var Human = require('../lib/human');

Human.setStorage({ dbpath: path.join(config.db, Human.prototype.plural)}, LevelupAdapter);

//-----------------------------------------------------------------

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session(
{
	secret: config.session_secret,
	ttl: config.SESSION_TTL,
	store: new RedisStore(),
	cookie: { maxAge: config.SESSION_TTL }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.csrf());

app.use(function(request, response, next)
{
	response.locals.flash = {};
	response.locals.flash.info = request.flash('info');
	response.locals.flash.error = request.flash('error');
	response.locals.flash.success = request.flash('success');
	response.locals.flash.warning = request.flash('warning');

	next();
});

app.use(app.router);

// development only
if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
	app.locals.pretty = true;
}

//-----------------------------------------------------------------

app.get('/', routes.index);
app.get('/signup', routes.signup);
app.post('/signup', routes.signupPost);

//-----------------------------------------------------------------

http.createServer(app).listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});
