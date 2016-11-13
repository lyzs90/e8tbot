const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {
    return gulp.src('src/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch('src/app.js', ['default']);
  // Other watchers
})

gulp.task('dev', () => {
  gulp.start('default');
  nodemon({
    script: './dist/app.js',
    env: {
        'NODE_ENV': 'development',
        'FIREBASE_API_KEY': '<Your Firebase Api Key>',
        'FIREBASE_PID': '<Your Firebase Project ID>',
        'LUIS_ID': '<Your Luis ID>',
        'LUIS_SUB_KEY': '<Your LUIS Subscription Key>'
    },
    ignore: ['./dist/'] // ignore not necessary
  })
  //have nodemon run watch on start
  .on('restart', ['watch']);
});