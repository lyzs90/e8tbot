'use strict';

var builder = require('botbuilder');
var Promise = require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var shuffleArray = require('../lib/shuffleArray');
var createDeck = require('../lib/createDeck');

// MongoDB Parameters
var uri = process.env.MONGODB_URI;
var collection = process.env.MONGODB_COLLECTION;

var library = new builder.Library('nearbyRestaurants');

// Nearby Restaurants Dialog
library.dialog('/', [function (session) {
    // Parameterized query
    var selector = {
        'geometry': {
            '$nearSphere': {
                '$geometry': {
                    'type': 'Point',
                    'coordinates': [session.userData.location.longitude, session.userData.location.latitude]
                },
                '$maxDistance': 1500
            }
        }
    };

    // Execute MongoDB query
    MongoClient.connectAsync(uri, collection, selector).then(function (db) {
        console.log('Success: Connected to MongoDB');
        return db.collection(collection).findAsync(selector);
    }).then(function (cursor) {
        return cursor.toArrayAsync();
    }).then(function (docs) {
        console.log('Success: Found the following records');
        console.log(docs);

        // End conversation if no results found
        if (docs.length === 0) {
            console.log('Ending conversation...');
            session.endConversation('Sorry, I couldn\'t find anything nearby. We have to start over :(');
        }
        return shuffleArray(docs);
    }).then(function (arr) {
        // Create deck of cards
        var tmpDeck = [];
        createDeck(session, tmpDeck, arr, 3);

        // Show deck as a carousel
        var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tmpDeck);
        console.log('Success: Carousel Created');
        session.send(msg);
    }).then(function () {
        console.log('Ending dialog...');
        session.endDialog();
    }).catch(function (err) {
        console.log('Failure: Carousel not sent');
        throw err;
    });
}]);

module.exports = library;