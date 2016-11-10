'use strict';

var restify = require('restify');
var builder = require('botbuilder');

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
var model = 'https://api.projectoxford.ai/luis/v1/application?id=6c38cfec-6c40-4e48-9b7b-8218cbf7f285&subscription-key=6515729ea96541bf85e9a4a0a26e5030';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

//=============================================================================
// Bot Dialogs
//=============================================================================

bot.dialog('/', [function (session) {
    session.send("Hi there, I'm Coconut. Let me know what food you're craving and I'll point you in the right direction.");
    session.beginDialog('/food');
}]);

bot.dialog('/food', intents);
intents.matches('FindNearby', [function (session, args) {
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
    session.send("Finding... " + task.entity);
    session.send("Is there something else you would like to eat?");
}]).onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that. What's that you were craving for again?"));