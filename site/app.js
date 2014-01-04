var
	express        = require('express'),
	flash          = require('connect-flash'),
	http           = require('http'),
	LevelupAdapter = require('polyclay-levelup'),
	LocalStrategy  = require('passport-local').Strategy,
	passport       = require('passport'),
	path           = require('path'),
	RedisStore     = require('connect-redis')(express)
	;

var
	auth   = require('./routes/auth'),
	config = require('../config'),
	posts  = require('./routes/posts'),
	routes = require('./routes')
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
app.use(express.static(path.join(__dirname, 'public')));
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

// development only
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

passport.use(new LocalStrategy(auth.validateLogin));
passport.serializeUser(function(user, callback)
{
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback)
{
	Human.find(id, callback);
});

//-----------------------------------------------------------------

app.get('/', routes.index);
app.get('/signup', routes.signup);
app.post('/signup', routes.signupPost);
app.get('/signin', auth.login);
app.post('/signin',
	passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
	auth.loginPost);
app.get('/signout', auth.logout);
app.get('/post', loginRequired, posts.post);
app.post('/post', loginRequired, posts.postPost); // I love this line of code.


app.get('/faves', routes.faves);
app.get('/queue', routes.queue);
app.get('/profile', routes.profile);

//-----------------------------------------------------------------

http.createServer(app).listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});
