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

bot.dialog('/', [function (session, args, next) {
    if (!session.userData.name && !session.userData.age && !session.userData.snack) {
        session.beginDialog('/profile');
    } else {
        session.beginDialog('/food');
    }
}]);

bot.dialog('/profile', [function (session) {
    session.send("Hi there, I'm still a young coconut. When I grow up, I aspire be able to hold my own in serious conversations.");
    setTimeout(function () {
        return builder.Prompts.text(session, "May I know your name?");
    }, 2000);
}, function (session, results) {
    session.userData.name = results.response;
    builder.Prompts.number(session, "Hi " + results.response + ". How old are you?");
}, function (session, results) {
    session.userData.age = results.response;
    builder.Prompts.choice(session, "What is your favourite snack?", ["Koko Krunch", "Julie's Peanut Butter Sandwich", "Pepero"]);
}, function (session, results) {
    session.userData.snack = results.response.entity;
    session.send("Got it... " + session.userData.name + " you are " + session.userData.age + " years old and you like " + session.userData.snack + ".");
    setTimeout(function () {
        return session.send("What would you like to eat today " + session.userData.name + " ?");
    }, 2000);
    session.beginDialog('/food');
}]);

bot.dialog('/food', intents);
intents.matches('FindNearby', [function (session, args) {
    var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
    session.send("Finding..." + task.entity);
    session.endDialog();
}]).onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));