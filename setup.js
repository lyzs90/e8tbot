'use strict';
var fs = require('fs');
fs.createReadStream('sample-gulpfile.js')
  .pipe(fs.createWriteStream('gulpfile.js'));
