var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('compress', function () {
  return gulp.src('src/**/*.js')
		.pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['compress']);
gulp.task('watch', ['build'], function () {
    gulp.watch(['./src/**/*.js'], ['build']);
});

gulp.task('default', ['build']);
