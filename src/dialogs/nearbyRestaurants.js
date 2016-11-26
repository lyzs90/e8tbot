'use strict';

const builder = require('botbuilder');
const mongodb = require('mongodb');
const assert = require('assert');
const findDocuments = require('../lib/findDocuments');
const createDeck = require('../lib/createDeck');
const shuffleArray = require('../lib/shuffleArray');

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

const library = new builder.Library('nearbyRestaurants');

// Nearby Restaurants Dialog
library.dialog('/', [
    (session) => {
        console.log(session.userData.location);
        // Parameterized query
        let selector = {
            'geometry': {
                '$nearSphere': {
                    '$geometry': {
                        'type': 'Point',
                        'coordinates': [
                            session.userData.location.longitude, session.userData.location.latitude
                        ]
                    },
                    '$maxDistance': 1500
                }
            }
        };
        // Execute MongoDB query
        mongodb.MongoClient.connect(uri, (err, db) => {
            assert.equal(null, err);
            console.log('Success: Connected to MongoDB');
            findDocuments(db, process.env.MONGODB_COLLECTION, selector, (docs) => {
                if (docs.length === 0) {
                    console.log('Ending conversation...');
                    session.endConversation('Sorry, I couldn\'t find anything nearby. We have to start over ):');
                }
                // Create deck of cards
                let tmpDeck = [];
                createDeck(session, tmpDeck, docs, 3, shuffleArray);
                let msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(tmpDeck);

                // Show deck as a carousel
                session.send(msg);
                db.close();
            });
        });
        console.log('Ending dialog...');
        session.endDialog();
    }
]);

module.exports = library;
