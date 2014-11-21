var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  path = {
    html: ['app/**/*.html'],
    scripts: ['app/**/*.js'],
    scss: ['app/**/*.scss', '!app/library/**/*.scss'],
    less: ['app/**/*.less', '!app/library/**/*.less']
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
  var s = plugins.sass({});
  s.on('error', function (e) {
    console.log(e);
    s.end();
  });
  gulp.src(path.scss)
    .pipe(s)
    .pipe(gulp.dest('.temp'));
});

gulp.task("lessToCSS", function () {
  var l = plugins.less({});
  l.on('error', function (e) {
    console.log(e);
    l.end();
  });
  gulp.src(path.less)
    .pipe(l)
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
    port: 9000,
    root: '.temp'
  });
});
var deploy = require('gulp-gh-pages');
gulp.task('deploy', function () {
    return gulp.src('./app/**/*')
        .pipe(deploy());
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(path.scripts, ['copyJS']);
  gulp.watch(path.html, ['copyHTML']);
  gulp.watch(path.scss, ['sassToCSS']);
  gulp.watch(path.less, ['lessToCSS']);
});
