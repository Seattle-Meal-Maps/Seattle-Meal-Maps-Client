'use strict'

const gulp = require('gulp');
const webpack = require('webpack-stream');

gulp.task('copy-css', () => {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-html', () => {
  return gulp.src('./app/**/*.css')
    .pipe(gulp.dest('./build'));
});

gulp.task('webpack', () => {
  return gulp.src('./entry.js')
    .pipe(webpack({
      output: {filename: 'bundle.js'},
      module: {
        loaders: [{
          test: /\.css$/,
          loaders: ['style', 'css']
        }]
      }
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['copy-html', 'copy-css', 'webpack']);
