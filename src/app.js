'use strict';

const restify = require('restify');
const builder = require('botbuilder');

// ============================================================================
// Bot Setup
// ============================================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    () => console.log('%s listening to %s', server.name, server.url)
);

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=============================================================================
// Bots Middleware
//=============================================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 0.1, resetCommand: /^reset/i }));

// ============================================================================
// Bot Dialogs
// ============================================================================

// Welcome Dialog
bot.dialog('/', [
    (session) => {
        // Reset userData
        session.userData.location = {};
        session.userData.skip = 0;

        // Send a card
        let card = new builder.HeroCard(session)
            .title(`Hi ${session.message.user.name}, I am Coconut!`)
            .text('Your friendly food recommendation chatbot.')
            .images([
                builder.CardImage.create(session, 'https://s21.postimg.org/i8h4uu0if/logo_cropped.png')
            ]);
        let msg = new builder.Message(session).attachments([card]);
        session.send(msg);

        // Ask user to make a choice
        session.replaceDialog('getChoice:/', {shareText: 'To see what\'s available nearby, just send me your location.'});
    }
]);

// Sub-Dialogs
bot.library(require('./dialogs/getChoice'));
bot.library(require('./dialogs/moreResults'));
bot.library(require('./dialogs/nearbyRestaurants'));
bot.library(require('./dialogs/getIntent'));
bot.library(require('./dialogs/setLocation'));
