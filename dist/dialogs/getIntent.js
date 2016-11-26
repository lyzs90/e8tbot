'use strict';

var builder = require('botbuilder');
var mongodb = require('mongodb');
var assert = require('assert');
var findDocuments = require('../lib/findDocuments');
var createDeck = require('../lib/createDeck');
var shuffleArray = require('../lib/shuffleArray');

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID + '&subscription-key=' + process.env.LUIS_SUB_KEY;
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

// Connect to MongoDB
var uri = process.env.MONGODB_URI;

var library = new builder.Library('getIntent');

// Intents Dialog
library.dialog('/', intents);

// Respond to answers like 'no', 'bye', 'goodbye', 'thank you'
intents.matches('SayBye', [function (session, args) {
    /* istanbul ignore next  */
    setTimeout(function () {
        return session.send('Alright, let me know if you need anything else.');
    }, 2000);
    console.log('Ending dialog...');
    session.endDialog();
}]);

// Respond to answers like 'i hate <food>', 'don't want to eat <food>'
intents.matches('SomethingElse', [function (session, args) {
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
    /* istanbul ignore next  */
    setTimeout(function () {
        return session.send('Ah, something other than ' + task.entity + '?');
    }, 2000);
    session.beginDialog('getIntent:/');
}]);

// Respond to answers like 'i want to eat <food>', '<food>', '<location>'
intents.matches('FindNearby', [function (session, args) {
    // If Location TODO: add support for food queries
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Location');
    session.send('Searching for... ' + task.entity);

    // Parameterized query TODO: add validation for queryString
    var regex = new RegExp('^' + task.entity + '$', 'i');
    var selector = { 'search': regex };

    // Execute MongoDB query
    mongodb.MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        console.log('Success: Connected to MongoDB');
        findDocuments(db, process.env.MONGODB_COLLECTION, selector, function (docs) {
            // Create deck of cards
            var tmpDeck = [];
            createDeck(session, tmpDeck, docs, 3, shuffleArray);
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tmpDeck);

            // Show deck as a carousel
            session.send(msg);
            db.close();
        });
    });

    /* istanbul ignore next  */
    setTimeout(function () {
        return session.send('What else would you like to search for?');
    }, 5000);
    session.beginDialog('getIntent:/');
}]);

// TODO: investigate why this doesnt handle defaults
intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that."));

module.exports = library;