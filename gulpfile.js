const gulp = require('gulp');
const ts = require('gulp-typescript');
const smp = require('gulp-sourcemaps');
const path = require('path');

gulp.task('start', ['build', 'watch']);

gulp.task('build', function () {
    return gulp.src('src/**/*.ts')
        .pipe(smp.init())
        .pipe(ts())
        .pipe(smp.write(path.join('maps')))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.ts'], ['build']);
});
