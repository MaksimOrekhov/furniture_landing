const gulp = require('gulp');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');

const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');

const browserSync = require('browser-sync').create();

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/*.pug',
        src: 'src/templates/**/*.pug'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles/'
    },    
    images: {
        src: 'src/images/**/*.*',
        dest: 'build/assets/images/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/assets/scripts/'
    },
    fonts: {
        src: 'src/fonts/**/*.*',
        dest: 'build/assets/fonts/'
    },
    icons: {
        src: 'src/icons/**/*.*',
        dest: 'build/assets/icons/'
    },
    php: {
        src: './*.php',
        dest: 'build/'
    },
    scriptsPush: {
        src: 'src/scripts/widgets/*.js',
        dest: 'build/assets/scripts/'
    }
}

// pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
    return gulp.src('./src/styles/app.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sass({ 
            includePaths: require('node-normalize-scss').includePaths
          }))
}

// очистка
function clean() {
    return del(paths.root);
}

// webpack
function scripts() {
    return gulp.src('./src/scripts/*.js')
        .pipe(plumber())
        // .pipe(gulpWebpack(webpackConfig, webpack)) 
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}

// галповский вотчер
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.icons.src, icons);
    gulp.watch(paths.php.src, php);
    gulp.watch(paths.scripts.src, scriptsPush);
}

// локальный сервер + livereload (встроенный)
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

//перенос php файлов
function php() {
    return gulp.src(paths.php.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.php.dest));
}

// перенос сторонних скриптов
function scriptsPush() {
    return gulp.src(paths.scriptsPush.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.scriptsPush.dest));
}

// просто переносим картинки
function images() {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.dest));
}

// перенос шрифтов
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest));
}

// перенос иконок
function icons() {
    return gulp.src(paths.icons.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.icons.dest));
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.fonts = fonts;
exports.icons = icons;
exports.php = php;
exports.scripts = scripts;
exports.scripts = scriptsPush;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, images, scripts, fonts, icons, php, scriptsPush),
    gulp.parallel(watch, server)
));