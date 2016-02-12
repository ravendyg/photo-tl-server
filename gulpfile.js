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
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    htmlmin = require('gulp-htmlmin');
var fs = require('fs');
    
// npm i gulp gulp-jshint jshint-stylish gulp-typescript gulp-sourcemaps gulp-cached --save-dev
// npm i del gulp-usemin gulp-minify-css gulp-uglify --save-dev
// npm i gulp-rename gulp-concat gulp-notify gulp-cache gulp-changed --save-dev

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

/** find templates in .directive
 * replace templateURL by template
 * insert templates directly into js
 */
gulp.task('inline-teplates', ['usemin'], function () {
    var output = '';
    // find templates
    output = fs.readFileSync('./build/bundle.js', 'utf8')
        .replace(/templateUrl/g, 'template');
    var templateFiles = output.match(/"components\/[a-zA-Z0-9\/]*.html"/g);
    var template = '';
// console.log(templateFiles);
    for (var i=0; i< templateFiles.length; i++) {
        // read template from file
        template = fs.readFileSync('./src/' + templateFiles[i].replace(/"/g, ''), 'utf8');
// console.log('./src/' + templateFiles[i]);
        // remove extra spaces, surround by single quotes, and insert into js
        output = output.replace(templateFiles[i],
            '\''+ template.replace(/(\n|\r)/g, '').replace(/\'/g, '\\\'').replace(/[ \t]{2,}/g, ' ') +'\'');
    }
    // output result    
    fs.writeFileSync('./build/bundle.js', output, 'utf8');
});

gulp.task('usemin',['jshint'], function () {
  return gulp.src('./src/index.html')
      .pipe(usemin({
        css: [minifycss(), 'concat'],
        js: [ uglify({ mangle: false })]
      }))
      .pipe(gulp.dest('build/'));
});