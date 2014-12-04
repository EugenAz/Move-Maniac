var gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass');

function handleError (err) {
  console.log(err.toString());
}

gulp.task('sass', function() {
  return gulp.src('src/scss/app.scss')
    .pipe(sass({
      style: 'compressed',
      'sourcemap=none': true
    }))
    .on('error', handleError)
    .pipe(rename({ basename: 'styles' }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch'], function () {

});
