'use strict';

const builder = require('botbuilder');
const resetData = require('../lib/resetData');

const library = new builder.Library('getLocation');

// User Location Dialog
library.dialog('/', new builder.SimpleDialog(
    (session, results) => {
        // Reset results before dialog begins
        resetData(session, results);

        let entities = session.message.entities;

        // TODO: refactor using CASE statements
        if (Array.isArray(entities) && entities.length && entities[0].geo) {
            let results = {response: entities[0].geo};
            session.replaceDialog('setLocation:/', results);
        } else if (/^.*(bye|goodbye|farewell|cya).*$/i.test(session.message.text)) {
            // if user says 'bye', end conversation
            session.endConversation('Bye!');
        } else {
            // TODO: refactor into usable component?
            let replyMessage = new builder.Message(session).text('To see what\'s available nearby, just send me your location.');
            replyMessage.sourceEvent({
                facebook: {
                    quick_replies: [
                        {
                            content_type: 'location'
                        }
                    ]
                }
            });
            session.send(replyMessage);
        }
    }
));

module.exports = library;
