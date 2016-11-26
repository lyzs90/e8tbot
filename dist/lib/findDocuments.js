'use strict';

var assert = require('assert');

var findDocuments = function findDocuments(db, collection, selector, callback) {
    db.collection(collection).find(selector).toArray(function (err, docs) {
        console.log('Success: Found the following records');
        console.log(docs);
        assert.equal(err, null);
        callback(docs);
    });
};

module.exports = findDocuments;