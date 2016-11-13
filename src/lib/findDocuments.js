var assert = require('assert');

var findDocuments = function(db, collection, callback) {
    // Get the documents collection
    var collection = db.collection(collection);
    // Find some documents
    collection.find({"search":"City Hall"}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Query success");
        callback(docs);
    });
}

module.exports = findDocuments;
