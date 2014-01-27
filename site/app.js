var
	_              = require('lodash'),
	express        = require('express'),
	flash          = require('connect-flash'),
	helmet         = require('helmet'), // TODO put to work
	http           = require('http'),
	LevelupAdapter = require('polyclay-levelup'),
	LocalStrategy  = require('passport-local').Strategy,
	passport       = require('passport'),
	path           = require('path'),
	RedisStore     = require('connect-redis')(express),
	validator      = require('express-validator')
	;

var
	config = require('../cfg'),
	routes = require('./routes')
	;

var app = express();

//-----------------------------------------------------------------
// Logging

app.logger  = require('../lib/logging')(config.logging);
var logstream =
{
	write: function(message, encoding) { app.logger.info(message.substring(0, message.length - 1)); }
};

//-----------------------------------------------------------------
// Databases
// This seriously needs to move.

var models = require('../lib/models');
_.each(models, function(Model, k)
{
	Model.setStorage({ dbpath: path.join(config.db, Model.prototype.plural)}, LevelupAdapter);
	app.logger.info(k + ' storage set in levelup');
});

//-----------------------------------------------------------------


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger({stream: logstream, format: 'dev'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(validator());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session(
{
	secret: config.session_secret,
	ttl: config.SESSION_TTL,
	store: new RedisStore(),
	cookie: { maxAge: config.SESSION_TTL }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.csrf());

app.use(function(request, response, next)
{
	response.locals.flash = {};
	response.locals.flash.info = request.flash('info');
	response.locals.flash.error = request.flash('error');
	response.locals.flash.success = request.flash('success');
	response.locals.flash.warning = request.flash('warning');

	response.locals.user = request.user;

	next();
});

app.use(app.router);

if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
	app.locals.pretty = true;
}

//-----------------------------------------------------------------
// middleware

function loginRequired(request, response, next)
{
	if (request.isAuthenticated()) { return next(); }
	response.redirect('/signin');
}

//-----------------------------------------------------------------
// jade helpers

var helpers = require('../lib/helpers');
helpers(app);

//-----------------------------------------------------------------

passport.use(new LocalStrategy(routes.auth.validateLogin));
passport.serializeUser(function(user, callback)
{
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback)
{
	models.Human.find(id, callback);
});

//-----------------------------------------------------------------

app.get('/', routes.main.index);
app.get(/\/day\/(.*)/, routes.day.listing);
app.get('/about', routes.main.about);

app.get('/signup', routes.registration.signup);
app.post('/signup', routes.registration.signupPost);
app.get('/signin', routes.auth.login);
app.post('/signin',
	passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
	routes.auth.loginPost);
app.get('/signout', routes.auth.logout);

app.get('/post/:id', routes.posts.post);
app.get('/post', loginRequired, routes.posts.postCreate);
app.post('/post', loginRequired, routes.posts.postPost); // I love this line of code.
app.get('/post/:id/edit', loginRequired, routes.posts.postEdit);
app.post('/post/:id/edit', loginRequired, routes.posts.postEditPost); // and this one

app.post('/post/:pid/comment', loginRequired, routes.comments.commentPost);

app.get('/faves', routes.main.faves);
// app.put('/fave/:id', loginRequired, routes.favorites.put);
app.get('/queue', routes.main.queue);

app.get('/profile/edit', loginRequired, routes.people.editProfile);
app.post('/profile/edit', loginRequired, routes.people.postEditProfile);
app.get('/profile/@:id', routes.people.profile);

app.get('/tags', routes.tags.all);
app.get('/tags/:tag', routes.tags.tag);

//-----------------------------------------------------------------

http.createServer(app).listen(app.get('port'), function()
{
	app.logger.info('Express server listening on port ' + app.get('port'));
});
