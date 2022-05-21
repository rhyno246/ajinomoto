var gulp = require("gulp"),
    sass = require("gulp-sass"),
    del  = require('del'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    babel = require('gulp-babel'),
    webpack = require('webpack-stream'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    node_modules_folder = './node_modules/',
    node_dependencies = Object.keys(require('./package.json').dependencies || {}),
    dist_folder = 'dist/',
    src_folder = 'src/';




gulp.task('clear', () => del([ dist_folder ]));

//html
const cbString = new Date().getTime();
gulp.task('html', () => {
    return gulp.src([src_folder + '*.html'], {
            base: src_folder,
            since: gulp.lastRun('html')
        })
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(gulp.dest(dist_folder))
        .pipe(browserSync.stream());
});




//sass
gulp.task('sass', () => {
    return gulp.src([
            src_folder + 'scss/**/*.scss',
        ], {})//can do sass or scss
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist_folder + 'css'))
        .pipe(browserSync.stream());
});


//fonts

gulp.task('fonts', () => {
    return gulp.src([src_folder + 'fonts/**/*'])
        .pipe(gulp.dest(dist_folder + 'fonts'))
        .pipe(browserSync.stream());
});


//js
gulp.task('js', () => {
    return gulp.src([src_folder + 'js/**/*.js'], {})
        .pipe(plumber())
        .pipe(webpack({
            mode: 'production'
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist_folder + 'js'))
        .pipe(browserSync.stream());
});


//image
gulp.task('images', () => {
    return gulp.src([src_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico|mp4)'], {})
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(dist_folder + 'images'))
        .pipe(browserSync.stream());
});

//vendor modules
gulp.task('vendor', () => {
    if (node_dependencies.length === 0) {
        return new Promise((resolve) => {
            console.log("No dependencies specified");
            resolve();
        });
    }

    return gulp.src(node_dependencies.map(dependency => node_modules_folder + dependency + '/**/*.*'), {
            base: node_modules_folder,
            since: gulp.lastRun('vendor')
        })
        //.pipe(gulp.dest(dist_folder + 'node_modules'))
        .pipe(browserSync.stream());
});


//vendors
gulp.task('vendors', function() {
    return gulp.src([src_folder +'vendor/**/*'],{})
        .pipe(gulp.dest(dist_folder + 'vendor'))
});




//port
gulp.task('serve', () => {
    return browserSync.init({
        server: {
            baseDir: ['dist']
        },
        port: 3000,
        open: false
    });
});

gulp.task('build', gulp.series('clear','sass','html','js','images','fonts','vendors','vendor'));
gulp.task('dev', gulp.series('sass','html','js', 'images','vendors','vendor'));

gulp.task('watch', () => {
    const watchImages = [
        src_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico|mp4)'
    ];
    const watchVendor = [];
    node_dependencies.forEach(dependency => {
        watchVendor.push(node_modules_folder + dependency + '/**/*.*');
    });
    const watch = [
        src_folder + 'scss/**/*.scss',
        src_folder + '*.html',
        src_folder + 'js/**/*.js',
        src_folder + 'fonts/**/*',
        src_folder + 'vendor/**/*',
        src_folder + 'vendors/**/*'
    ];
    gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
    gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});


gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));