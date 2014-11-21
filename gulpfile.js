var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  path = {
    scripts: ['**/*.js', '!library/vendor/**/*.js', '!node_modules/**/*.js', '!build/**/*.js', '!gulpfile.js'], // except vendor
    scss: ['**/*.scss', '!library/vendor/**/*.scss', '!node_modules/**/*.scss'], // except vendor
    less: ['**/*.less', '!library/vendor/**/*.less', '!node_modules/**/*.less'] // except vendor
  };

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['install', 'compress', 'documentation', 'sassToCss']);

gulp.task('compress', function () {
  gulp.src(path.scripts)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task("sassToCss", function () {
  gulp.src(path.scss)
    .pipe(plugins.sass())
    .pipe(gulp.dest('.temp/css'));
});

gulp.task("lessToCss", function () {
  gulp.src(path.less)
    .pipe(plugins.less())
    .pipe(gulp.dest('build/css'));
});

gulp.task("documentation", function () {
  gulp.src(path.scripts)
    .pipe(plugins.jsdoc('build/documentation'));
});

gulp.task('install', function () {
  gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.install());
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(path.scss, ['sassToCss']);
  gulp.watch(path.less, ['lessToCss']);
});
