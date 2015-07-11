'use strict';

var gulp = require('gulp'),
	connect = require('gulp-connect');

gulp.task('default', ['connect', 'watch']);

gulp.task('connect', function() {
	connect.server({
		port: 8000,
		root: 'app',
		livereload: true
	});
});

gulp.task('watch', function() {
	gulp.watch('**/*.html', ['watch:html']);
	gulp.watch('**/*.css', ['watch:css']);
	gulp.watch('**/*.js', ['watch:js']);
});

gulp.task('watch:html', function() {
	gulp.src('app/**/*.html')
		.pipe(connect.reload());
});

gulp.task('watch:css', function() {
	gulp.src('app/css/**/*.css')
		.pipe(connect.reload());
});

gulp.task('watch:js', function() {
	gulp.src('app/js/**/*.js')
		.pipe(connect.reload());
});