const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify-es').default;
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const tinify = require('gulp-tinify');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');

//compile scss into css
function sassCompile() {
    return gulp.src('*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('../gamepedia'))
    .pipe(browserSync.stream());
}


function watch() {
    browserSync.init({
        server: {
           baseDir: "../gamepedia"
        }
    });

    gulp.watch('*.scss', sassCompile)
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('*.js').on('change', browserSync.reload);
}

function bindingMinifyingHtmlJsCss() {
    return gulp.src('*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.html', htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'));
}

function compressJpgPngImage() {
    return gulp.src('img/**/*.+(png|jpg|jpeg)')
        .pipe(tinify('r7nxTjXW0XbSlQmlwLLRs4bvhBTZvT0y'))
        .pipe(gulp.dest('dist/img'));
}

function compressSvgGifIcoImage() {
    return gulp.src('img/**/*.+(gif|svg|ico)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
}

async function cleanDist() {
    return del.sync('dist');
}


exports.sassCompile = sassCompile;
exports.watch = watch;
exports.bindingMinifyingHtmlJsCss = bindingMinifyingHtmlJsCss;
exports.compressJpgPngImage = compressJpgPngImage;
exports.compressSvgGifIcoImage = compressSvgGifIcoImage;
exports.cleanDist = cleanDist;
exports.build = gulp.series(cleanDist, sassCompile, gulp.parallel(bindingMinifyingHtmlJsCss, compressJpgPngImage, compressSvgGifIcoImage));
exports.default = gulp.series(sassCompile, watch);