// var gulp = require('gulp'),
//     jshint = require('gulp-jshint'),
//     stylish = require('jshint-stylish');

// // jshint
// gulp.task('jshint', function () {
//     return gulp.src(['./server/*.js', './server.js'])
//         .pipe(jshint())
//         .pipe(jshint.reporter(stylish));
// });


var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('start', ['build', 'watch']);

gulp.task('build', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.ts'], ['build']);
});
