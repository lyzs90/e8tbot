'use strict';

var builder = require('botbuilder');
var mongodb = require('mongodb');
var assert = require('assert');
var findDocuments = require('../lib/findDocuments');
var createDeck = require('../lib/createDeck');
var shuffleArray = require('../lib/shuffleArray');

// Connect to MongoDB
var uri = process.env.MONGODB_URI;

var library = new builder.Library('nearbyRestaurants');

// Nearby Restaurants Dialog
library.dialog('/', [function (session) {
    console.log(session.userData.location);
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
    mongodb.MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        console.log('Success: Connected to MongoDB');
        findDocuments(db, process.env.MONGODB_COLLECTION, selector, function (docs) {
            if (docs.length === 0) {
                console.log('Ending conversation...');
                session.endConversation('Sorry, I couldn\'t find anything nearby. We have to start over ):');
            }
            // Create deck of cards
            var tmpDeck = [];
            createDeck(session, tmpDeck, docs, 3, shuffleArray);
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tmpDeck);

            // Show deck as a carousel
            session.send(msg);
            db.close();
        });
    });
    console.log('Ending dialog...');
    session.endDialog();
}]);

module.exports = library;