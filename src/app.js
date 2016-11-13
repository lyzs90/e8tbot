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
server.listen(process.env.port || process.env.PORT || 3978,
    () => console.log('%s listening to %s', server.name, server.url)
);

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

// Root Dialog
bot.dialog('/', [
    (session) => {
        // Send a card
        var card = new builder.HeroCard(session)
            .title("Hi, I am Coconut")
            .text("Your friendly neighbourhood food hunting bot")
            .images([
                 builder.CardImage.create(session, "https://s21.postimg.org/i8h4uu0if/logo_cropped.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Let me know what food you're craving and I'll point you in the right direction. If you would like me to recommend something nearby, just shout out your location :)"); // TODO: make this a query
        session.beginDialog('/food');
    }
]);

// Intents Dialog
bot.dialog('/food', intents);

// Respond to answers like 'no', 'bye', 'goodbye', 'thank you'
intents.matches('SayBye', [
    (session, args) => {
        setTimeout ( () => session.send("Alright, let me know if you need anything else."), 2000);
        session.endDialog();
    }
]);

// Respond to answers like 'i hate <food>', 'don't want to eat <food>'
intents.matches('SomethingElse', [
    (session, args) => {
        var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
        setTimeout ( () => session.send("Ah, something other than " + task.entity + "?"), 2000);
        session.beginDialog('/food');
    }
]);

// Respond to answers like 'i want to eat <food>', '<food>', '<location>'
intents.matches('FindNearby', [
    (session, args) => {
        var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
        session.send("Finding... " + task.entity);

        // Execute MongoDB Query TODO: link to response
        mongodb.MongoClient.connect(uri, function(err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            findDocuments(db, process.env.MONGODB_COLLECTION, function(docs) {
                session.send(docs[0].results[0].Name[0].text);
                db.close();
            });
        });
        //======================

        setTimeout ( () => session.send("Is there something else you would like to eat?"), 2000);
        session.beginDialog('/food');
    }
]);

intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that. Please state a craving or your location."));
