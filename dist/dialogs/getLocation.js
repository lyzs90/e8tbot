'use strict';

var builder = require('botbuilder');

var library = new builder.Library('getLocation');

// User Location Dialog TODO: handle rejection
library.dialog('/', new builder.SimpleDialog(function (session, args) {
    args = args || {};
    // initial setup
    var initialRetry = 2;
    session.dialogData.shareText = args.shareText || session.dialogData.shareText;
    session.dialogData.wrongLocationText = args.wrongLocationText || session.dialogData.wrongLocationText;

    var retry = session.dialogData.hasOwnProperty('maxRetries') ? session.dialogData.maxRetries : initialRetry;
    var entities = session.message.entities;

    // only dialogData has "maxRetries" property, otherwise do not check as first runs
    // because using session data directly would possibly cause infinite loop
    if (session.dialogData.hasOwnProperty('maxRetries') && Array.isArray(entities) && entities.length && entities[0].geo) {
        session.endDialogWithResult({ response: entities[0].geo });
    } else if (retry === 0) {
        // max retry, quit
        session.endDialogWithResult({});
    } else {
        if (retry < initialRetry) {
            session.send(session.dialogData.wrongLocationText || 'Looks it is not a valid location.');
        }

        var replyMessage = new builder.Message(session).text(session.dialogData.shareText || 'Please share your location.');
        replyMessage.sourceEvent({
            facebook: {
                quick_replies: [{
                    content_type: 'location'
                }]
            }
        });
        session.send(replyMessage);

        retry -= 1;
        session.dialogData.maxRetries = retry;
    }
}));

module.exports = library;