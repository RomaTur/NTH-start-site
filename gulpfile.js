
///////////////////////
/////......../////////

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const groupMediaQueries = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-cleancss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');

const paths =  {
  src: 'src/',              // paths.src
  build: 'build/',           // paths.build
  project: 'NTH-start-site/' // paths.project - name of project
};


////////////////////////////////////
////////////WATCH///////////////////
////////////////////////////////////
gulp.task('sass-watch', function(){

    return gulp.src(paths.src+'sass/main.sass')
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gulp.dest(paths.build + 'css/'))
        .pipe(browserSync.reload({stream: true}))

});

gulp.task('scripts-watch', function(){
    var headScripts =  gulp.src(paths.src + 'js/headScripts/*.js')
            .pipe(plumber())
            .pipe(concat('headScripts.js'))
            .pipe(gulp.dest(paths.build + 'js/'));
    var footerScripts = gulp.src(paths.src+'js/footerScripts/*.js')
            .pipe(plumber())
            .pipe(concat('footerScripts.js'))
            .pipe(gulp.dest(paths.build + 'js/'))
            .pipe(browserSync.reload({stream: true}));
    return headScripts, footerScripts;

});

gulp.task('html-watch',function(){
  return gulp.src(paths.src + '*.html')
    .pipe(plumber())
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
    .pipe(gulp.dest(paths.build))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('onlyMove-watch',function(){
    let img = gulp.src(paths.src + 'img/**/*.*')
            .pipe(plumber())
            .pipe(gulp.dest(paths.build + 'img/'))
            .pipe(browserSync.reload({stream: true}));
    let fonts = gulp.src(paths.src + 'fonts/**/*.*')
                .pipe(plumber())
                .pipe(gulp.dest(paths.build + 'fonts/'));
    let favicon = gulp.src(paths.src + 'favicon.ico')
                .pipe(plumber())
                .pipe(gulp.dest(paths.build ));
    return img , fonts, favicon;
});
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////





////////////////////////////////////
////////////BUILD///////////////////
////////////////////////////////////
gulp.task('sass', function(){

    return gulp.src(paths.src+'sass/main.sass')
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(groupMediaQueries())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.build + 'css/'))

});

gulp.task('scripts', function(){
    let headScripts =  gulp.src(paths.src + 'js/headScripts/*.js')
            .pipe(plumber())
            .pipe(uglify())
            .pipe(concat('headScripts.js'))
            .pipe(gulp.dest(paths.build + 'js/'));
    let footerScripts = gulp.src(paths.src+'js/footerScripts/*.js')
            .pipe(plumber())
            .pipe(uglify())
            .pipe(concat('footerScripts.js'))
            .pipe(gulp.dest(paths.build + 'js/'));
    return headScripts, footerScripts;

});

gulp.task('html',function(){
  return gulp.src(paths.src + '*.html')
    .pipe(plumber())
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
    .pipe(gulp.dest(paths.build));
});

gulp.task('onlyMove',function(){
    let img = gulp.src(paths.src + 'img/**/*.*')
            .pipe(plumber())
            .pipe(gulp.dest(paths.build + 'img/'));
    let fonts = gulp.src(paths.src + 'fonts/**/*.*')
                .pipe(plumber())
                .pipe(gulp.dest(paths.build + 'fonts/'));
    let favicon = gulp.src(paths.src + 'favicon.ico')
                .pipe(plumber())
                .pipe(gulp.dest(paths.build ));
    return img , fonts, favicon;
});
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

gulp.task('clean', function(){
    return del(paths.build)
});


gulp.task('watch', function(){
    gulp.watch(paths.src + 'sass/**/*.sass', gulp.series('sass-watch'));
    gulp.watch(paths.src + 'js/**/*.js', gulp.series('scripts-watch'));
    gulp.watch(paths.src + '*.html', gulp.series('html-watch'));
    gulp.watch([paths.src + 'img/**/*.*', paths.src + 'fonts/**/*.*', paths.src + 'favicon.ico'], gulp.series('onlyMove-watch'));
});

gulp.task('serve', function() {
    browserSync({
        notify:false,
        open:true,
        port: 8888,
        proxy: "http://localhost:8888/"+paths.project+paths.build
    });
});
///////////////////////////////////////////////////////////
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('sass', 'scripts', 'html', 'onlyMove')
));
////////////////////////////////////////////////////////////
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('sass-watch', 'scripts-watch', 'html-watch', 'onlyMove'),
  gulp.parallel('watch', 'serve')
));
