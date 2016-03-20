var
	_            = require('lodash'),
	bodyParser   = require('body-parser'),
	bole         = require('bole'),
	Controller   = require('../lib/controller'),
	cookieParser = require('cookie-parser'),
	csurf        = require('csurf'),
	express      = require('express'),
	favicon      = require('serve-favicon'),
	flash        = require('connect-flash'),
	helmet       = require('helmet'), // TODO put to work
	http         = require('http'),
	models       = require('../lib/models'),
	LocalStrategy = require('passport-local').Strategy,
	passport     = require('passport'),
	path         = require('path'),
	session      = require('express-session')
	RedisStore   = require('connect-redis')(session),
	routes       = require('./routes'),
	validator    = require('express-validator')
	;

require('dotenv').config();

var app = express();
var controller = new Controller();
app.set('controller', controller);

app.logger  = bole('www');
var logstream = { write: function(message, encoding) { app.logger.info(message.substring(0, message.length - 1)); } };

//-----------------------------------------------------------------

app.set('port', process.env.WEB_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(require('morgan')('dev', { stream: logstream }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(validator());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	secret: process.env.SESSION_SECRET,
	ttl:    process.env.SESSION_TTL,
	store:  new RedisStore({ url: process.env.REDIS_URL }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(csurf());

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

if ('development' == app.get('env'))
{
	app.use(require('errorhandler')());
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

app.route('/').get(routes.main.index);
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

app.route('/_monitor/ping').get(function(request, response)
{
	response.status(200).send('OK');
});

//-----------------------------------------------------------------

http.createServer(app).listen(app.get('port'), function()
{
	app.logger.info('Express server listening on port ' + app.get('port'));
});
