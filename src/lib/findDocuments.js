'use strict';

const assert = require('assert');

let findDocuments = (db, collection, selector, callback) => {
    db.collection(collection).find(selector).toArray((err, docs) => {
        console.log('Success: Found the following records');
        console.log(docs);
        assert.equal(err, null);
        callback(docs);
    });
}

module.exports = findDocuments;
