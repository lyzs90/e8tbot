'use strict';

const builder = require('botbuilder');
const mongodb = require('mongodb');
const assert = require('assert');
const findDocuments = require('../lib/findDocuments');
const createDeck = require('../lib/createDeck');
const shuffleArray = require('../lib/shuffleArray');

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
const model = `https://api.projectoxford.ai/luis/v1/application?id=\
${process.env.LUIS_ID}&subscription-key=${process.env.LUIS_SUB_KEY}`;
const recognizer = new builder.LuisRecognizer(model);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

const library = new builder.Library('food');

// Intents Dialog
library.dialog('/', intents);

// Respond to answers like 'no', 'bye', 'goodbye', 'thank you'
intents.matches('SayBye', [
    (session, args) => {
        /* istanbul ignore next  */
        setTimeout(() => session.send('Alright, let me know if you need anything else.'), 2000);
        console.log('Ending dialog...');
        session.endDialog();
    }
]);

// Respond to answers like 'i hate <food>', 'don't want to eat <food>'
intents.matches('SomethingElse', [
    (session, args) => {
        let task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
        /* istanbul ignore next  */
        setTimeout(() => session.send(`Ah, something other than ${task.entity}?`), 2000);
        session.beginDialog('food:/');
    }
]);

// Respond to answers like 'i want to eat <food>', '<food>', '<location>'
intents.matches('FindNearby', [
    (session, args) => {
        // If Location TODO: add support for food queries
        let task = builder.EntityRecognizer.findEntity(args.entities, 'Location');
        session.send(`Searching for... ${task.entity}`);

        // Parameterized query TODO: add validation for queryString
        let regex = new RegExp(`^${task.entity}$`, 'i');
        let selector = { 'search': regex };

        // Execute MongoDB query
        mongodb.MongoClient.connect(uri, (err, db) => {
            assert.equal(null, err);
            console.log('Success: Connected to MongoDB');
            findDocuments(db, process.env.MONGODB_COLLECTION, selector, (docs) => {
                // Create deck of cards
                let tmpDeck = [];
                createDeck(session, tmpDeck, docs, 5, shuffleArray);
                let msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(tmpDeck);

                // Show deck as a carousel
                session.send(msg);
                db.close();
            });
        });

        /* istanbul ignore next  */
        setTimeout(() => session.send('What else would you like to search for?'), 5000);
        session.beginDialog('food:/');
    }

]);

// TODO: investigate why this doesnt handle defaults
intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that."));

module.exports = library;
