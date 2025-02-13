/**
 * gulpfile.babel.js
 *
 * @Author : Mayank Sindwani
 * @Date   : 2016-09-05
 * @Description : Build script.
 *
 * The MIT License(MIT)
 * Copyright(c) 2016 Mayank Sindwani
 **/

const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const eslint     = require('gulp-eslint');
const min        = require('gulp-minify');
const mocha      = require('gulp-mocha');
const help       = require('gulp-help');
const karma      = require('karma');
const tasks      = require('gulp');
const del        = require('del');

const gulp = help(tasks);

gulp.task('clean', 'Removes the distribution folder', (cb) => {
    // Delete the distribution folder.
    return del('dist', cb);
});

gulp.task('lint', 'Lints the scripts', () => {
    // Lint the src script.
    return gulp.src(['src/mhtml2html.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', 'Creates the distribution scripts', ['lint', 'clean'], () => {
    // Transpile es6 to es5 and output debug + production scripts.
    return browserify({
            entries: 'src/mhtml2html.js',
            standalone: 'mhtml2html'
        })
        .transform("babelify", { presets: ["env"],  })
        .bundle()
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(source('mhtml2html.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'))
        .pipe(min())
        .pipe(gulp.dest('dist'));
});

gulp.task('test', 'Runs tests for mhtml2html', ['build'], (cb) => {
    // Test in a browser context.
    new karma.Server({
        configFile: __dirname + '/karma.config.js',
        singleRun: true,
        browsers: ['Chrome']
    }, code => {
        if (code != 0) {
            process.exit(code);
        } else {
            // Test using Node.js.
            gulp
                .src(['tests/**/*.js'], { read: false })
                .pipe(mocha({
                    useColors: true
                }))
                .on('end', cb);
        }
    }).start();
});

gulp.task('default', 'Runs the default build process', ['test']);
