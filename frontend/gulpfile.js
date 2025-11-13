'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var cssbeautify = require('gulp-cssbeautify');
var del = require("del");

gulp.task('sass', function () {
  return gulp.src(['src/**/*.scss'])
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(gulp.dest('../css_from_scss/src/app'))
    .on('error', function (err) {
      console.log(err.message + ' on line ' + err.lineNumber + ' in file : ' + err.fileName);
    });
});


gulp.task('less', function () {
  return gulp.src(['./src/**/*.less'])
    .pipe(less())
    .pipe(cssbeautify())
    .pipe(gulp.dest('../css_from_less/src/app'))
    .on('error', function (err) {
      console.log(err.message + ' on line ' + err.lineNumber + ' in file : ' + err.fileName);
    });
});

gulp.task("clean", function () {
  return del("build");
});
