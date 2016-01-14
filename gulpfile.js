var gulp = require("gulp");
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');

gulp.task('babel', function() {
  gulp.src('./src/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('./scripts'));
});

gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['babel']);
});

gulp.task('default', ['babel', 'watch']);
