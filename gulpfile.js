var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    cache = require('gulp-cached');
    // browserify = require('gulp-browserify');
    // webserver = require('gulp-webserver'),
    // browserSync = require('browser-sync');
    
// npm i gulp gulp-jshint jshint-stylish gulp-typescript gulp-sourcemaps gulp-cached --save-dev

// watch
gulp.task('watch', function () {
   gulp.watch(['./**/*.ts'], ['compileTs']);
//    gulp.watch('./*.ts', ['compileTs']);
//    gulp.watch('src/styles/*.sass', ['styles']);
   gulp.watch(['./src/**/*.js', './*.js',
    '!./src/bower_components/**/*.js', '!./node_modules/**/*.js'], ['jshint']);
//    gulp.watch('./*.js', ['jshint']);
});

// compileTS
gulp.task('compileTs', function () {
    var tsResult = gulp.src(['./src/**/*.ts', './*.ts'])
    .pipe(sourcemaps.init())
    .pipe(ts({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: false,
        removeComments: false,
    }));
		
	tsResult.dts.pipe(gulp.dest(function(file) {
        return file.base;
    }));
	return tsResult.js
				.pipe(sourcemaps.write('src/maps'))
				.pipe(gulp.dest(function(file) {
                    return file.base;
                }));   
});

// jshint
gulp.task('jshint', function () {
    return gulp.src(['./src/**/*.js', './*.js',
        '!./src/bower_components/**/*.js', '!./node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// compileTSServer
gulp.task('compileTsServer', function () {
    var tsResult = gulp.src('*.ts')
    .pipe(sourcemaps.init())
    .pipe(ts({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: false,
        removeComments: false,
    }));
		
	tsResult.dts.pipe(gulp.dest(''));
	return tsResult.js
				.pipe(sourcemaps.write('maps'))
				.pipe(gulp.dest(''));   
});

// jshintServer
gulp.task('jshintServer', function () {
    return gulp.src(['*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});