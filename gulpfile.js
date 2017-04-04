/*
 * @Author: Kaidong Zhang 
 * @Date: 2017-04-04 15:56:27 
 * @Last Modified by: Kaidong Zhang
 * @Last Modified time: 2017-04-04 16:11:32
 */
'use strict';

const
    fs = require('fs'),
    gulp = require('gulp'),
    babel = require('gulp-babel');

gulp.task('default', function() {
    gulp.src('./src/**')
        .pipe(babel())
        .on('error', function(err) {
            console.log('==================================');
            console.log(err.name);
            console.log(err.message);
            console.log(err.stack);
            console.log();
            this.emit('end');
        })
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
    gulp.watch('./src/**', ['default']);
});