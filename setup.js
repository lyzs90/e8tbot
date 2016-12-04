'use strict';
var fs = require('fs');

// Setup dev gulpfile. Remember to fill up environmental variables
fs.createReadStream('sample-gulpfile.js')
    .pipe(fs.createWriteStream('gulpfile.js'));

// Configure FB thread settings. Remember to fill up page access token
fs.createReadStream('sample-setup-fb.js')
    .pipe(fs.createWriteStream('setup-fb.js'));
