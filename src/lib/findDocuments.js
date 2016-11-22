var assert = require('assert');

var findDocuments = (db, collection, selector, callback) => {
    // Get the documents collection
    const coll = db.collection(collection);
    // Find some documents
    coll
        .find(selector)
        .toArray((err, docs) => {
            assert.equal(err, null);
            console.log('Query success');
            callback(docs);
        });
}

module.exports = findDocuments;
