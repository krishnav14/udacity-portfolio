var gulp = require('gulp');
var config = require('./config.json');
var del = require('del');
var responsive = require('gulp-responsive');
var runSequence = require('run-sequence');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
gulp.task('copyMinBootstrapToDist',function(){
  return gulp.src(config.nodeSrc+config.bootstrapPath+'dist/css/bootstrap.min.css')
  .pipe(gulp.dest(config.dist+'external/css'));
});
gulp.task('minifyNormalizeToDist',function(){
  return gulp.src(config.nodeSrc+config.normalizePath+"normalize.css")
  .pipe(rename('normalize.min.css'))
  .pipe(gulp.dest(config.dist+'external/css'));
});

gulp.task('clean',function(){
 return del([config.dist]);
});

gulp.task('create-responsive',function(){
  return gulp.src(config.src+"img_src/responsive/"+"**/*.{png,jpeg,jpg}")
  .pipe(gulp.dest(config.dist+"img/"));
});

gulp.task('copyHtmlToDist',function(){
  return gulp.src(config.src+"**/*.html")
    .pipe(gulp.dest(config.dist));
});

gulp.task('copyImgToDist',['create-responsive'],function() {
  return gulp.src(config.src+"img_src/**[^responsive]/*")
    .pipe(gulp.dest(config.dist+"img/"));
});

gulp.task('minifyCss',['copyMinBootstrapToDist','minifyNormalizeToDist'],function(){
  return gulp.src(config.src+"css/**/*")
    .pipe(sourcemaps.init())
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dist+"css/"));
});

gulp.task('srcToDist',['copyHtmlToDist','copyImgToDist','minifyCss']);
gulp.task('dist',['srcToDist'])
gulp.task('dev',['create-responsive']);
gulp.task('default',function(){
  runSequence('clean','dist');
});
