var gulp = require('gulp');
var config = require('./config.json');
var del = require('del');
var gp_responsive = require('gulp-responsive');
var runSequence = require('run-sequence');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var gp_concat = require('gulp-concat');

var globalResponsiveParams = {
      errorOnEnlargement: false,
      errorOnUnused: false,
      passThroughUnused: true,
      quality: 80,
      withMetadata: false,
      compressionLevel: 7,
      max: true,
}

var responsiveConfigParams = {
  '*_main*.{png,jpg,JPG,jpeg,JPEG}': [{
    width: 700,
    rename: {
      suffix: '-700px@1x',
    }
  },{
    width: 700*2,
    rename: {
      suffix: '-700@2x'
    }
  },{
    width: 1000,
    rename: {
      suffix: '-1000@1x'
    }
  },{
    width: 1000*2,
    rename: {
      suffix: '-1000@2x'
    }
  }],
  '*_featured*.{png,jpg,JPG,jpeg,JPEG}': [{
    width: 220,
    rename: {
      suffix: '-220px@1x',
    }
  },{
    width: 220*2,
    rename: {
      suffix: '-220@2x',
    }
  },{
    width: 400,
    rename: {
      suffix: '-400@1x',
    }
  },{
    width: 400*2,
    rename: {
      suffix: '-400@2x'
    }
  },{
    width: 800,
    rename: {
      suffix: '-800@1x',
    }
  },{
    width: 800*2,
    rename: {
      suffix: '-800@2x'
    }
  }]
};
/*
  * Clean task to delete the dist dir
*/
gulp.task('clean',function(){
 return del([config.dist]);
});

/*
* Copy minified bootstrap to dist folder from node modules
*/
gulp.task('copyMinBootstrapToDist',function(){
  return gulp.src(config.nodeSrc+config.bootstrapPath+'dist/css/bootstrap.min.css')
  .pipe(gulp.dest(config.dist+'external/css'));
});

/*
* Copy minimified normalize to the dist folder from node modules
*/
gulp.task('copyMinNormalizeToDist',function(){
  return gulp.src(config.nodeSrc+config.normalizePath+"normalize.css")
  .pipe(rename('normalize.min.css'))
  .pipe(gulp.dest(config.dist+'external/css'));
});

/*
* Create images in different sizes
*/
gulp.task('create-responsive',function(){
  return gulp.src(config.src+"img_src/responsive/"+"**/*.{png,jpeg,jpg,JPG,JPEG,PNG}")
  .pipe(gp_responsive(responsiveConfigParams,globalResponsiveParams))
  .pipe(gulp.dest(config.dist+"img/"));
});

/*
*
*/
gulp.task('copyHtmlToDist',function(){
  return gulp.src(config.src+"**/*.html")
    .pipe(gulp.dest(config.dist));
});

/*
*
*/
gulp.task('copyImgToDist',['create-responsive'],function() {
  return gulp.src(config.src+"img_src/**[^responsive]/*")
    .pipe(gulp.dest(config.dist+"img/"));
});

/*
* Minify Css and copy to dist
*/
gulp.task('minifyCss',['copyMinBootstrapToDist','copyMinNormalizeToDist'],function(){
  return gulp.src(config.src+"css/**/*")
    .pipe(gp_concat("styles.css"))
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
