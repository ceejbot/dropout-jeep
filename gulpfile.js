var
	gulp       = require('gulp'),
	browserify = require('gulp-browserify'),
	changed    = require('gulp-changed'),
	concat     = require('gulp-concat'),
	filter     = require('gulp-filter'),
	gutil      = require('gulp-util'),
	jscs       = require('gulp-jscs'),
	less       = require('gulp-less'),
	rename     = require('gulp-rename'),
	uglify     = require('gulp-uglify'),
	watch      = require('gulp-watch'),
	path       = require('path')
	;

gulp.task('default', function()
{
	gulp.run('lint', 'css', 'js', 'libs');
});

gulp.task('css', function()
{
	gulp.src('./build/less/**/*.less')
	.pipe(changed('./site/public/css'))
	.pipe(less({
		paths: [ path.join(__dirname, 'bower_components', 'bootstrap', 'less') ]
	}))
	.pipe(gulp.dest('./site/public/css'));
});

gulp.task('images', function()
{
	// TODO
});

gulp.task('libs', function()
{
	gulp.src(['./bower_components/rivets/dist/rivets.min.js'], { base: './bower_components/rivets/dist' })
	.pipe(changed('./site/public/js'))
	.pipe(gulp.dest('./site/public/js'));

	gulp.src(['./bower_components/bootstrap/dist/js/*.js'], { base: './bower_components/bootstrap/dist/js' })
	.pipe(changed('./site/public/js'))
	.pipe(gulp.dest('./site/public/js'));

/*
	gulp.src('./js/*.js')
	.pipe(concat('libraries.js'))
	.pipe(gulp.dest('./site/public/js'))
	.pipe(rename('libraries.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./site/public/js'));
*/
});

gulp.task('js', function()
{
	gulp.src('./build/js/app.js')
	.pipe(changed('./site/public/js'))
	.pipe(browserify())
	.pipe(gulp.dest('./site/public/js'));
});

gulp.task('watch-css', function()
{
	gulp.src('./build/less/**/*.less')
	.pipe(watch())
	.pipe(less({
		paths: [ path.join(__dirname, 'bower_components', 'bootstrap', 'less') ]
	}))
	.pipe(gulp.dest('./site/public/css'));
});

gulp.task('lint', function()
{
	gulp.src(['*.js', './lib/**/*.js', '.test/*.js', './site/routes/*.js', './site/app.js'])
	.pipe(jscs());
});
