var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    cache = require('gulp-cached');
    // browserify = require('gulp-browserify');
    // webserver = require('gulp-webserver'),
    // browserSync = require('browser-sync');
var del = require('del'),
     usemin = require('gulp-usemin'),
     uglify = require('gulp-uglify'),
     minifycss = require('gulp-minify-css');
    
// npm i gulp gulp-jshint jshint-stylish gulp-typescript gulp-sourcemaps gulp-cached --save-dev
// npm i del gulp-usemin gulp-minify-css gulp-uglify --save-dev

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
                .pipe(sourcemaps.write('./maps'))
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



// Default task
gulp.task('build', ['clean'], function() {
    // gulp.start('usemin', 'imagemin','copy');
    gulp.start('usemin', 'copy');
    // gulp.start('copy');
});

// Clean
gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('copy', ['clean'], function() {
   gulp.src('./src/assets/**/*')
   .pipe(gulp.dest('./build/assets'));
});

gulp.task('usemin',['jshint'], function () {
  return gulp.src('./src/index.html')
      .pipe(usemin({
        css: [minifycss()],
        js: [uglify()],
      }))
      .pipe(gulp.dest('build/'));
});