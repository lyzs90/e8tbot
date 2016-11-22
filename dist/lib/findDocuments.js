'use strict';

var assert = require('assert');

var findDocuments = function findDocuments(db, collection, selector, callback) {
    db.collection(collection).find(selector).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

module.exports = findDocuments;