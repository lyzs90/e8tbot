'use strict';

const builder = require('botbuilder');
const Promise = require('bluebird');
const MongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
//const shuffleArray = require('../lib/shuffleArray');
const sortArray = require('../lib/sortArray');
const createDeck = require('../lib/createDeck');

// MongoDB Parameters
const uri = process.env.MONGODB_URI;
const collection = process.env.MONGODB_COLLECTION;

const library = new builder.Library('nearbyRestaurants');

// Nearby Restaurants Dialog
library.dialog('/', [
    (session) => {
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
                    '$maxDistance': 1200
                }
            }
        };

        // Execute MongoDB count query
        MongoClient.connectAsync(uri, collection, selector)
            .then((db) => {
                return db.collection(collection).countAsync(selector);
            })
            .then((count) => {
                console.log(`Success: Total of ${count} records`);
                session.userData.count = count;
            })
            .catch((err) => {
                console.log('Failure: Count failed');
                throw err;
            });

        // Execute MongoDB find query
        MongoClient.connectAsync(uri, collection, selector)
            .then((db) => {
                return db.collection(collection).findAsync(selector, {
                    'limit': 5,
                    'skip': session.userData.skip
                });
            })
            .then((cursor) => {
                return cursor.toArrayAsync();
            })
            .then((docs) => {
                console.log('Success: Found the following records');
                console.log(docs.length);

                // End conversation if no results found
                if (docs.length === 0) {
                    console.log('Ending conversation...');
                    session.endConversation('Sorry, I couldn\'t find anything nearby. We have to start over :(');
                }
                //return shuffleArray(docs);
                return sortArray.byDistance(session, docs, sortArray.haversine);
            })
            .then((arr) => {
                // Persist results array to session.userData
                session.userData.arr = arr

                // Create deck of cards
                let tmpDeck = [];
                createDeck(session, tmpDeck, arr, 5);

                // Show deck as a carousel
                let msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(tmpDeck);
                console.log('Success: Carousel Created');
                session.send(msg);
            })
            .then(() => {
                console.log('Ending dialog...');
                session.userData.skip += 5;
                session.endDialog();
            })
            .catch((err) => {
                console.log('Failure: Carousel not sent');
                throw err;
            });
    }
]);

module.exports = library;
