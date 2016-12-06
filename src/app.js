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

//=========================================================
// Bot Menu Actions
//=========================================================

bot.beginDialogAction('nearby', 'getLocation:/', { matches: /^nearby/i });
bot.beginDialogAction('search', 'getIntent:/', { matches: /^search/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

// ============================================================================
// Bot Dialogs
// ============================================================================

// Welcome Dialog
bot.dialog('/', [
    (session) => {
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
        builder.Prompts.choice(session, 'What can I help you with?', ['What\'s Nearby', 'I want to eat...']);
    },
    (session, results) => {
        // TODO: handle more rejection options
        if (/^.*(bye|goodbye|farewell|cya).*$/i.test(results.response.entity)) {
            session.endDialog('Cya (:');
        }
        if (results.response.entity === 'What\'s Nearby') {
            session.beginDialog('getLocation:/', results);
        }
        if (results.response.entity === 'I want to eat...') {
            session.beginDialog('getIntent:/', results);
        }
    },
    (session, results) => {
        // The menu runs a loop until the user chooses to (quit).
        builder.Prompts.choice(session, 'Please choose a valid option.', ['getChoice', 'Bye']);
    }
]);

bot.dialog('/help', [
    function (session) {
        session.endDialog('Global commands that are available anytime:\n\n**What\'s Nearby** - Get recommendations for nearby food.\n\n**I want to eat...** - Craving for something? Just key that in!\n\n**Help** - You\'re looking at it.\n\n**Goodbye** - End this conversation.');
    }
]);

// Sub-Dialogs
bot.library(require('./dialogs/getLocation'));
bot.library(require('./dialogs/moreResults'));
bot.library(require('./dialogs/getRestaurants'));
bot.library(require('./dialogs/getIntent'));
bot.library(require('./dialogs/setLocation'));
