var
	gulp       = require('gulp'),
	browserify = require('gulp-browserify'),
	changed    = require('gulp-changed'),
	concat     = require('gulp-concat'),
	gutil      = require('gulp-util'),
	jscs       = require('gulp-jscs'),
	less       = require('gulp-less'),
	watch      = require('gulp-watch'),
	path       = require('path')
	;

gulp.task('default', function()
{

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

});

gulp.task('libs', function()
{

});

gulp.task('js', function()
{
	// browserify it up
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
