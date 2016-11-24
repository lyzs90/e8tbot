'use strict';

var restify = require('restify');
var builder = require('botbuilder');

// ============================================================================
// Bot Setup
// ============================================================================

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

// ============================================================================
// Bot Dialogs
// ============================================================================

// Welcome Dialog
bot.dialog('/', [function (session) {
    // Send a card
    var card = new builder.HeroCard(session).title('Hi ' + session.message.user.name + ', I am Coconut').text('Your friendly neighbourhood food hunting bot').images([builder.CardImage.create(session, 'https://s21.postimg.org/i8h4uu0if/logo_cropped.png')]);
    var msg = new builder.Message(session).attachments([card]);
    session.send(msg);
    session.beginDialog('location:/', { shareText: 'If you would like me to recommend something nearby, please send me your location :)' });
}, function (session, results) {
    console.log('Success: Received User Location');
    session.send('Current location...\n            Latitude: ' + results.response.latitude + '\n            Longitude: ' + results.response.longitude);
    // TODO: reverse Geocoding and string matching
    session.send('That feature is still WIP. Please state your location.');
    session.beginDialog('food:/');
}]);

// Sub-Dialogs
bot.library(require('./dialogs/location'));
bot.library(require('./dialogs/food'));