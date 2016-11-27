const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');

// Task to transpile to ES6
gulp.task('build', () => {
    return gulp.src(['src/app.js', 'src/lib/*.js'], { base: './src/' })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

// Task to start nodemon and handle restarts. dependent on build task.
gulp.task('dev', ['build'], () => {
    nodemon({
        script: './dist/app.js',
        env: {
            'NODE_ENV': 'development',
            'MICROSOFT_APP_ID': '<Your Microsoft App ID>',
            'MICROSOFT_APP_PASSWORD': '<Your Microsoft App Password>',
            'LUIS_ID': '<Your Luis ID>',
            'LUIS_SUB_KEY': '<Your LUIS Subscription Key>',
            'MONGODB_URI': '<Your MongoDB URI>',
            'MONGODB_COLLECTION': '<Your MongoDB Collection>',
            'GOOGLE_GEOCODE_KEY': '<Your Google Maps Geocoding API Key>'
        },
        ignore: ['./dist/'] // ignore not necessary
    })
    .on('restart', ['build']);
});

// Default Task
gulp.task('default', ['build', 'dev']);
