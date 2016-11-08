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

//=============================================================================
// Bot Dialogs
//=============================================================================

// Waterfall
bot.dialog('/', [function (session) {
    session.send("Hi there, I'm still a young coconut. When I grow up, I aspire be able to hold my own in serious conversations.");
    setTimeout(function () {
        return builder.Prompts.text(session, "May I know your name?");
    }, 1000);
}, function (session, results) {
    session.userData.name = results.response;
    builder.Prompts.number(session, "Hi " + results.response + ". How old are you?");
}, function (session, results) {
    session.userData.age = results.response;
    builder.Prompts.choice(session, "What is your favourite snack?", ["Koko Krunch", "Julie's Peanut Butter Sandwich", "Pepero"]);
}, function (session, results) {
    session.userData.snack = results.response.entity;
    session.send("Got it... " + session.userData.name + " you are " + session.userData.age + " years old and you like " + session.userData.snack + ".");
}]);