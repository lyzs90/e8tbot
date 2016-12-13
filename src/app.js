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
bot.use(builder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

//=========================================================
// Bot Menu Actions
//=========================================================

bot.beginDialogAction('nearby', 'getLocation:/', { matches: /^nearby/i });
bot.beginDialogAction('search', 'getIntent:/', { matches: /^search/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^(bye|goodbye|farewell|cya)/i });

// ============================================================================
// Bot Dialogs
// ============================================================================

// Welcome Dialog
bot.dialog('/', [
    (session) => {
        // Send a card
        let card = new builder.HeroCard(session)
            .title(`Hi ${session.message.user.name}, I am E-8T!`)
            .subtitle('Your friendly food recommendation chatbot.')
            .images([
                builder.CardImage.create(session, 'https://s18.postimg.org/unu3q3iah/e8t_logo_xs.png')
            ])
        let msg = new builder.Message(session).attachments([card]);
        session.send(msg);

        // Ask user to make a choice
        builder.Prompts.choice(session, 'What can I help you with?', ['What\'s Nearby', 'General Search']);
    },
    (session, results) => {
        // TODO: handle more rejection options
        if (/^.*(bye|goodbye|farewell|cya).*$/i.test(results.response.entity)) {
            session.endDialog('Cya (:');
        }
        if (results.response.entity === 'What\'s Nearby') {
            session.beginDialog('getLocation:/', results);
        }
        if (results.response.entity === 'General Search') {
            session.beginDialog('getIntent:/', results);
        }
    }
]);

bot.dialog('/help', [
    function (session) {
        session.send('The following commands are globally available:')
        // Send a carousel
        let msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title('What\'s Nearby')
                    .subtitle('Get recommendations for nearby food.'),
                new builder.HeroCard(session)
                    .title('General Search')
                    .subtitle('Craving for something? Just key that in!'),
                new builder.HeroCard(session)
                    .title('Help')
                    .subtitle('You\'re looking at it.')
            ]);
        session.send(msg);
        session.endDialog();
    }
]);

// Sub-Dialogs
bot.library(require('./dialogs/getLocation'));
bot.library(require('./dialogs/moreResults'));
bot.library(require('./dialogs/getRestaurants'));
bot.library(require('./dialogs/getIntent'));
bot.library(require('./dialogs/setLocation'));
