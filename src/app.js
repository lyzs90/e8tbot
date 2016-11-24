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

// ============================================================================
// Bot Dialogs
// ============================================================================

// Welcome Dialog
bot.dialog('/', [
    (session) => {
        // Send a card
        let card = new builder.HeroCard(session)
            .title(`Hi ${session.message.user.name}, I am Coconut`)
            .text('Your friendly neighbourhood food hunting bot')
            .images([
                builder.CardImage.create(session, 'https://s21.postimg.org/i8h4uu0if/logo_cropped.png')
            ]);
        let msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.beginDialog('location:/', {shareText: 'If you would like me to recommend something nearby, please send me your location :)'});
    },
    (session, results) => {
        console.log('Success: Received User Location');
        session.send(`Current location...
            Latitude: ${results.response.latitude}
            Longitude: ${results.response.longitude}`);
        // TODO: reverse Geocoding and string matching
        session.send('That feature is still WIP. Please state your location.')
        session.beginDialog('food:/');
    }
]);

// Sub-Dialogs
bot.library(require('./dialogs/location'));
bot.library(require('./dialogs/food'));
