var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  path = {
    scripts: ['**/*.js', '!library/vendor/**/*.js', '!node_modules/**/*.js', '!build/**/*.js', '!gulpfile.js'] // except vendor
  };

gulp.task('default', ['watch', 'build']);

gulp.task('build', ['compress', 'documentation']);

gulp.task('compress', function () {
  gulp.src(path.scripts)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task("documentation", function () {
  gulp.src(path.scripts)
    .pipe(plugins.jsdoc('build/documentation'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(path.scripts, ['compress']);
});
