var gulp = require('gulp');
var react = require('gulp-react');
var watch = require('gulp-watch');

gulp.task('default', function () {
    return gulp.src('./react/app.react.jsx')
        .pipe(watch('./react/app.react.jsx'))
        .pipe(react())
        .pipe(gulp.dest('public'));
});
