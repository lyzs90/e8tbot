'use strict';

var restify = require('restify');
var builder = require('botbuilder');
var mongodb = require('mongodb');
var assert = require('assert');
var findDocuments = require('./lib/findDocuments');

//=============================================================================
// Database Setup
//=============================================================================

// Connect to MongoDB
var uri = process.env.MONGODB_URI;

//=============================================================================
// Bot Setup
//=============================================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    return console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID + '&subscription-key=' + process.env.LUIS_SUB_KEY;
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

//=============================================================================
// Bot Dialogs
//=============================================================================

// Welcome Dialog
bot.dialog('/', [function (session) {
    // Send a card
    var card = new builder.HeroCard(session).title("Hi, I am Coconut").text("Your friendly neighbourhood food hunting bot").images([builder.CardImage.create(session, "https://s21.postimg.org/i8h4uu0if/logo_cropped.png")]);
    var msg = new builder.Message(session).attachments([card]);
    session.send(msg);
    session.send("Let me know what food you're craving and I'll point you in the right direction. If you would like me to recommend something nearby, just shout out your location :)");
    session.beginDialog('/food');
}]);

// Intents Dialog
bot.dialog('/food', intents);

// Respond to answers like 'no', 'bye', 'goodbye', 'thank you'
intents.matches('SayBye', [function (session, args) {
    setTimeout(function () {
        return session.send("Alright, let me know if you need anything else.");
    }, 2000);
    session.endDialog();
}]);

// Respond to answers like 'i hate <food>', 'don't want to eat <food>'
intents.matches('SomethingElse', [function (session, args) {
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
    setTimeout(function () {
        return session.send("Ah, something other than " + task.entity + "?");
    }, 2000);
    session.beginDialog('/food');
}]);

// Respond to answers like 'i want to eat <food>', '<food>', '<location>'
intents.matches('FindNearby', [function (session, args) {

    // If Location
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Location');
    session.send("Finding... " + task.entity);

    // Parameterized query TODO: add validation for queryString
    var regex = new RegExp("^" + task.entity + "$", 'i');
    var selector = { "search": regex };

    // Execute query TODO: display card
    mongodb.MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        findDocuments(db, process.env.MONGODB_COLLECTION, selector, function (docs) {
            /*
            var str = '';
            var i = 1;
            docs[0].results.forEach( (result, i) => {
                i += 1;
                // Template literals
                str += `${i}. ${result.Name[0].text} \n\n`;
            });
            session.send(str);
            */

            // Display results in a carousel
            // Ask the user to select an item from a carousel.
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments([new builder.HeroCard(session).title(docs[0].results[0].Name[0].text).subtitle(docs[0].results[0].Category[0].text + ', ' + docs[0].results[0].Rating[0].text).text(docs[0].results[0].Address[0].text).images([builder.CardImage.create(session, docs[0].results[0].Image[0].src).tap(builder.CardAction.showImage(session, docs[0].results[0].Image[0].src))]).buttons([builder.CardAction.openUrl(session, docs[0].results[0].Image[0].href, "Reviews"), builder.CardAction.imBack(session, "select:100", "Like")]), new builder.HeroCard(session).title(docs[0].results[1].Name[0].text).subtitle(docs[0].results[1].Category[0].text + ', ' + docs[0].results[1].Rating[0].text).text(docs[0].results[1].Address[0].text).images([builder.CardImage.create(session, docs[0].results[1].Image[0].src).tap(builder.CardAction.showImage(session, docs[0].results[1].Image[0].src))]).buttons([builder.CardAction.openUrl(session, docs[0].results[1].Image[0].href, "Reviews"), builder.CardAction.imBack(session, "select:101", "Like")]), new builder.HeroCard(session).title(docs[0].results[2].Name[0].text).subtitle(docs[0].results[2].Category[0].text + ', ' + docs[0].results[2].Rating[0].text).text(docs[0].results[2].Address[0].text).images([builder.CardImage.create(session, docs[0].results[2].Image[0].src).tap(builder.CardAction.showImage(session, docs[0].results[2].Image[0].src))]).buttons([builder.CardAction.openUrl(session, docs[0].results[2].Image[0].href, "Reviews"), builder.CardAction.imBack(session, "select:102", "Like")])]);
            // Show carousel
            builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
            db.close();
        });
    });

    setTimeout(function () {
        return session.send("Is there something else you would like to eat?");
    }, 5000);
    session.beginDialog('/food');
}]);

intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that. Please state a craving or your location."));