var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  path = {
    html: ['app/**/*.html'],
    scripts: ['app/**/*.js'],
    scss: ['app/**/*.scss'],
    less: ['app/**/*.less']
  };

gulp.task('default', ['build', 'serve', 'watch']);

gulp.task('build', ['install', 'copyJS', 'copyHTML', 'sassToCSS', 'lessToCSS']);

gulp.task('compress', function () {
  gulp.src(path.scripts)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('copyJS', function () {
  gulp.src(path.scripts)
    .pipe(gulp.dest('.temp'));
});

gulp.task('copyHTML', function () {
  gulp.src(path.html)
    .pipe(gulp.dest('.temp'));
});

gulp.task("sassToCSS", function () {
  gulp.src(path.scss)
    .pipe(plugins.sass())
    .pipe(gulp.dest('.temp'));
});

gulp.task("lessToCSS", function () {
  gulp.src(path.less)
    .pipe(plugins.less())
    .pipe(gulp.dest('.temp'));
});

gulp.task("documentation", function () {
  gulp.src(path.scripts)
    .pipe(plugins.jsdoc('build/documentation'));
});

gulp.task('install', function () {
  gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.install());
});

gulp.task('serve', function () {
  plugins.connect.server({
    port: 4000,
    root: '.temp'
  });
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(path.html, ['copyJS']);
  gulp.watch(path.html, ['copyHTML']);
  gulp.watch(path.scss, ['sassToCss']);
  gulp.watch(path.less, ['lessToCss']);
});
