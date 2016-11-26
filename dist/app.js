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

//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

// ============================================================================
// Bot Dialogs
// ============================================================================

// Welcome Dialog
bot.dialog('/', [function (session) {
    // Send a card
    var card = new builder.HeroCard(session).title('Hi ' + session.message.user.name + ', I am Coconut').text('Your friendly neighbourhood food hunting bot').images([builder.CardImage.create(session, 'https://s21.postimg.org/i8h4uu0if/logo_cropped.png')]);
    var msg = new builder.Message(session).attachments([card]);
    session.send(msg);
    session.beginDialog('getLocation:/', { shareText: 'If you would like me to recommend something nearby, please send me your location :)' });
}, function (session, results) {
    if (typeof results.response === 'undefined') {
        console.log('Failure: Invalid Location');
        session.endConversation('You entered an invalid location. We need to start over.');
    };
    console.log('Success: Received User Location');
    // Persist user location
    session.userData.location = results.response;
    // TODO: do reverse geocoding here
    session.send('Finding places near you...');
    // Pass user location as args to nearbyRestaurants dialog
    session.beginDialog('nearbyRestaurants:/', session.userData.location);
}, function (session) {
    setTimeout(function () {
        return builder.Prompts.choice(session, 'What would you like to do next?', ['More Results', 'Bye']);
    }, 5000);
}, function (session, results) {
    if (results.response.entity === 'More Results') {
        console.log('Ending conversation...');
        session.endConversation('WIP. Ending conversation...');
    };
    if (results.response.entity === 'Bye') {
        console.log('Ending conversation...');
        session.endConversation('Have a good day (:');
    };
}]);

// Sub-Dialogs
bot.library(require('./dialogs/getLocation'));
bot.library(require('./dialogs/nearbyRestaurants'));
//bot.library(require('./dialogs/getIntent')); TODO: handle free form queries