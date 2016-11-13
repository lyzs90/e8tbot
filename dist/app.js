'use strict';

var restify = require('restify');
var builder = require('botbuilder');
var firebase = require('firebase');
var https = require('https');

//=============================================================================
// Database Setup
//=============================================================================

// Initialize Firebase
var config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_PID + ".firebaseapp.com",
    databaseURL: "https://" + process.env.FIREBASE_PID + ".firebaseio.com",
    storageBucket: "gs://" + process.env.FIREBASE_PID + ".appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();

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

// Root Dialog
bot.dialog('/', [function (session) {
    // Send a card
    var card = new builder.HeroCard(session).title("Coconut").text("Your friendly neighbourhood food hunting bot").images([builder.CardImage.create(session, "https://s13.postimg.org/hc4wcsjo7/logo.png")]);
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

// Respond to answers like 'i want to eat <food>', '<food>' TODO: allow location
intents.matches('FindNearby', [function (session, args) {
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
    session.send("Finding... " + task.entity);

    // Stub Firebase Request.
    //TODO: use Firebase retrieval instead of https.get
    //      options: craving + location, just location
    var req = https.get(config.databaseURL + '/searches/0/result/extractorData/data/0/group/0/Name/0/text.json', function (res) {
        console.log(res.statusCode);
        res.on('data', function (chunk) {
            return session.send(JSON.parse(chunk));
        });
    });

    req.on('error', function (e) {
        console.error(e);
    });
    //

    setTimeout(function () {
        return session.send("Is there something else you would like to eat?");
    }, 2000);
    session.beginDialog('/food');
}]);

intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that. Please state a craving or your location."));