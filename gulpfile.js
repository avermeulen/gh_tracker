var gulp = require('gulp');
var react = require('gulp-react');
 
gulp.task('default', function () {
    return gulp.src('./react/app.react.jsx')
        .pipe(react())
        .pipe(gulp.dest('public'));
});
