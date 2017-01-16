/*
 * Configurations
 */

var config = {
    'root': 'app/dist/',
    'src' : 'app/src/',
    'dist': 'app/dist/'
}


/*
 * Requires
 */

var gulp         = require('gulp'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    sass         = require('gulp-sass'),
    minify       = require('gulp-minify'),
    sourcemaps   = require('gulp-sourcemaps'),
    connect      = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename');


/*
 * Tasks
 */

// Connect
gulp.task('connect', function() {

    connect.server({
        root: 'app/dist',
        livereload: true
    });
});


// HTML
gulp.task('html', () => {
    return gulp.src(config.src + '*.html')
        .pipe(gulp.dest(config.dist))
        .pipe(connect.reload())
        .pipe(notify('HTML updated: <%= file.relative %>'))
})


// Sass
gulp.task('sass', function(){
    return gulp.src( config.src + 'scss/*.scss' )
        .pipe(plumber({errorHandler: notify.onError('Error : <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest( config.dist + 'assets/css'))
        .pipe(connect.reload())
        .pipe(notify('Saas compiled : <%= file.relative %> !'));
});


// Js
gulp.task('javascript', function() {
    return gulp.src( config.src + 'js/*.js')
        .pipe(plumber({errorHandler: notify.onError('JS Error : <%= error.message %> ! ')}))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            ignoreFiles: ['.min.js'],
            noSource: false,
        }))
        .pipe(gulp.dest( config.dist + 'assets/js'))
        .pipe(connect.reload())
        .pipe(notify('JS compiled : <%= file.relative %> !'));;
});


// Watch
gulp.task('watch', function() {
    gulp.watch( [ config.src + 'js/*.js'], ['javascript'] );
    gulp.watch( [ config.src + 'scss/**/*.scss'], ['sass'] );
    gulp.watch( [ config.src + '*.html'], ['html'] );
})


// Build
gulp.task('build', ['html', 'sass', 'javascript'], function() {});


// Default
gulp.task('default', ['build', 'connect', 'watch'], function() {});