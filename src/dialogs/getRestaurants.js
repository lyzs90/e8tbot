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

const library = new builder.Library('getRestaurants');

// Nearby Restaurants Dialog
library.dialog('/', [
    (session) => {
        // TODO: if selector is the same, dont hit db
        MongoClient.connectAsync(uri)
            .then((db) => {
                return db.collection(collection).countAsync(session.userData.selector);
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
        MongoClient.connectAsync(uri)
            .then((db) => {
                return db.collection(collection).findAsync(session.userData.selector, {
                    'limit': 5,
                    'skip': session.userData.cursor
                });
            })
            .then((cursor) => {
                return cursor.toArrayAsync();
            })
            .then((docs) => {
                console.log(`Success: Found ${docs.length} records`);

                // End conversation if no results found
                if (docs.length === 0) {
                    console.log('Ending conversation...');
                    session.endConversation('Sorry, I couldn\'t find anything nearby. We have to start over :(');
                }
                //return shuffleArray(docs);
                return sortArray.byDistance(session, docs, sortArray.haversine);
            })
            .then((arr) => {
                // Create deck of cards
                let tmpDeck = [];
                createDeck(session, tmpDeck, arr, 5);

                // Show deck as a carousel
                let msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(tmpDeck);
                console.log('Success: Carousel Created');
                return session.send(msg);
            })
            .then(() => {
                console.log('Ending dialog...');
                session.userData.cursor += 5;
                return session.replaceDialog('moreResults:/');
            })
            .catch((err) => {
                console.log('Failure: Carousel not sent');
                throw err;
            });
    }
]);

module.exports = library;
