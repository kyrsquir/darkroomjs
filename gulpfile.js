var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var rimraf = require('rimraf');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var uglify = require('gulp-uglify');

//
// Variables
//
var srcDir = './src';
var distDir = './build';
var isDebug = !gutil.env.prod;

//
// Default
//
gulp.task('default', ['build'], function () {
    gulp.start('watch');
});

//
// Clean
//
gulp.task('clean', function (cb) {
    rimraf(distDir, cb);
});

//
// Build
//
gulp.task('build', ['clean'], function () {
    gulp.start('scripts', 'styles');
});

//
// Watch
//
gulp.task('watch', ['server'], function () {
    gulp.watch(srcDir + '/js/**/*.js', ['scripts']);
    gulp.watch(srcDir + '/css/**/*.scss', ['styles']);
});

//
// Server
//
gulp.task('server', function () {
    connect.server({
        root: './demo',
        port: 2222,
        livereload: false
    });
});

//
// Javascript
//
gulp.task('scripts', function () {
    var svgs = gulp.src(srcDir + '/icons/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({inlineSvg: true}));
    // .pipe(gulp.dest(distDir));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    var files = [
        srcDir + '/js/core/*.js',
        //plugin order equals button order
        srcDir + '/js/plugins/darkroom.history.js',
        srcDir + '/js/plugins/darkroom.rotate.js',
        srcDir + '/js/plugins/darkroom.crop.js',
        srcDir + '/js/plugins/darkroom.save.js',
        srcDir + '/js/plugins/darkroom.download.js'
    ];

    gulp.src(files)
        .pipe(plumber())
        .pipe(isDebug ? sourcemaps.init() : gutil.noop())
        .pipe(concat('metadata-cropper.js', {newLine: ';'}))
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(isDebug ? gutil.noop() : uglify({mangle: false}))
        .pipe(isDebug ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(distDir))
});

//
// Stylesheet
//
gulp.task('styles', function () {
    gulp.src(srcDir + '/css/metadata-cropper.scss')
        .pipe(plumber())
        .pipe(isDebug ? sourcemaps.init() : gutil.noop())
        .pipe(sass({
            outputStyle: isDebug ? 'nested' : 'compressed'
        }))
        .pipe(isDebug ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(distDir))
});