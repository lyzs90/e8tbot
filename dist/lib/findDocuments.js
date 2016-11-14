"use strict";

var assert = require('assert');

var findDocuments = function findDocuments(db, collection, selector, callback) {
    // Get the documents collection
    var collection = db.collection(collection);
    // Find some documents
    collection.find(selector).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Query success");
        callback(docs);
    });
};

module.exports = findDocuments;