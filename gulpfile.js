var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('js/app.js')
      .pipe(plumber(function (error) {
          gutil.log(error.message);
          this.emit('end');
      }))
      .pipe(browserify())
      .pipe(babel({
        presets: ['env']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*.scss")
        .pipe(plumber(function (error) {
            gutil.log(error.message);
            this.emit('end');
        }))
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('images', function (done) {
    return gulp.src('img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/img'));
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['js', 'sass'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("js/*.js", ['js-watch']);
});
