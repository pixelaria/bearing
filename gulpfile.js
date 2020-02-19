"use strict";
var gulp = require('gulp');

var pug = require('gulp-pug'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require('browser-sync'),
    postcss = require('gulp-postcss'),
    cssnano = require('gulp-cssnano'),
    mqpacker = require('css-mqpacker'),
    autoprefixer = require('autoprefixer'),
    jsmin = require('gulp-jsmin'),

    notify = require('gulp-notify'),
    concat = require('gulp-concat');

gulp.task('pug', () => {
    console.log('---------- Компиляция pug');
    return gulp.src('./src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Компиляция LESS
gulp.task('less', () => {
    console.log('--- Компиляция LESS');

    return gulp.src('src/less/*.less') // Берем less только с первого уровня
        .pipe(concat('bundle.css'))
        .pipe(less()) // Преобразуем LESS в CSS посредством gulp-less
        .on('error', notify.onError(function(err) {  // Отлавливаем ошибки компиляции
            return {
                title: 'Styles compilation error',
                message: err.message
            }
        }))
        .pipe(cleanCSS()) // чистим css
        .pipe(postcss([
            autoprefixer({browsers: ['last 10 version']}), // вендорные префиксы
            mqpacker({sort: true}), // конкатенация media query
        ]))
        .pipe(gulp.dest('./docs/css/')) // Выгружаем результата в папку docs/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// Сборка и минификация собственного JS для продакшена
gulp.task('js', () => {
    return gulp.src('./src/js//*.js') //собираем все js файлы
        .pipe(concat('bundle.js'))
        .pipe(jsmin())
        .pipe(gulp.dest('./docs/js/'))
        .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

// Сборка и минификация CSS библиотек
gulp.task('libs', function() {
    console.log('---------- Минификация CSS библиотек');

    gulp.src('src/libs/css/*.css') // Берем less только с первого уровня
        .pipe(concat('libs.min.css')) // Собираем их в кучу в новом файле libs.min.css
            .pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('./docs/css')); // Выгружаем в папку docs/css

    gulp.src('src/libs/js/*.js') // Берем less только с первого уровня
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.css
        .pipe(jsmin()) // Сжимаем
        .pipe(gulp.dest('./docs/js/')); // Выгружаем в папку docs/css
});

// Таск Browser-sync
gulp.task('browser-sync', function(done) {
    browserSync.init({
        server: {
            baseDir: 'docs'
        },
        notify: false
    });
    done()
});



gulp.task('default',
    gulp.series(
        gulp.parallel('browser-sync','pug', 'less','js'),
        function(done){
            gulp.watch('./src/less/**/*.less', gulp.series('less'));
            gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));
            gulp.watch('./src/js/**/*.js', gulp.series('js'));
            done()
        })
);
