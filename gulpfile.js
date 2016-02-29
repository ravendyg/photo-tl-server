var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

// watch
gulp.task('watch', function () {
    gulp.watch(['./server/*.js','./server.js'], ['jshint']);
});

// jshint
gulp.task('jshint', function () {
    return gulp.src(['./server/*.js', './server.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});