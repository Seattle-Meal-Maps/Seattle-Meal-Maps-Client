'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const sources = {
  html: __dirname + '/app/**/*.html',
  js: __dirname + '/app/**/*.js',
  test: __dirname + '/test/*_spec.js',
  images: __dirname + '/app/**/*'


};
gulp.task('default', function() {
  return gulp.src('./app/entry.js')
    .pipe(webpack())
    .pipe(gulp.dest('build/'));
});

gulp.task('build:css', function() {
  gulp.src('app/assets/sass/index.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/'));
});

gulp.task('bundle:dev', () => {
  return gulp.src(sources.js)
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('copy', () => {
  return gulp.src(sources.html)
    .pipe(gulp.dest('./build'));
});


gulp.task('copy:image', () => {
  return gulp.src(sources.images)
    .pipe(gulp.dest('./build'));
});

gulp.task('bundle:test', () => {
  return gulp.src(sources.test)
    .pipe(webpack({output: {filename: 'test_bundle.js'}}))
    .pipe(gulp.dest('./test'));
});



gulp.task('default', ['bundle:dev', 'copy:image', 'copy', 'build:css','bundle:test']);
