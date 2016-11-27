const gulp = require('gulp');
const babel = require('gulp-babel');

// Task to transpile to ES6
gulp.task('build', () => {
    return gulp.src(['src/app.js', 'src/**/*.js'], { base: './src/' })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', ['build']);
