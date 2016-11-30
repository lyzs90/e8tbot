'use strict';

const builder = require('botbuilder');

const library = new builder.Library('getLocation');

// User Location Dialog TODO: handle rejection
library.dialog('/', new builder.SimpleDialog(
    (session, args) => {
        args = args || {};
        // initial setup
        let initialRetry = 2;
        session.dialogData.shareText = args.shareText || session.dialogData.shareText;

        let retry = session.dialogData.hasOwnProperty('maxRetries') ? session.dialogData.maxRetries : initialRetry;
        let entities = session.message.entities;

        // only dialogData has "maxRetries" property, otherwise do not check as first runs
        // because using session data directly would possibly cause infinite loop
        if (session.dialogData.hasOwnProperty('maxRetries') && Array.isArray(entities) && entities.length && entities[0].geo) {
            session.endDialogWithResult({response: entities[0].geo});
        } else if (session.message.text === 'payloadIntent') {
            session.send('What would you like to eat?');
            session.beginDialog('getIntent:/');
        } else if (retry === 0) {
            // max retry, quit
            session.endDialogWithResult({});
        } else if (/^.*bye.*$/i.test(session.message.text)) {
            // if user says 'bye', end conversation
            session.endConversation('Bye!');
        } else {
            if (retry < initialRetry) {
                console.log(session.message.text);
                session.send('You have to make a choice.');
            }
            // REVIEW: consider doing away with send message button, straight away go into intent dialog if user does not send location
            let replyMessage = new builder.Message(session).text(session.dialogData.shareText);
            replyMessage.sourceEvent({
                facebook: {
                    quick_replies: [
                        {
                            content_type: 'location'
                        },
                        {
                            content_type: 'text',
                            title: 'Send Message',
                            payload: 'payloadIntent'
                        }
                    ]
                }
            });
            session.send(replyMessage);

            retry -= 1;
            session.dialogData.maxRetries = retry;
        }
    }
));

module.exports = library;
