'use strict';

const builder = require('botbuilder');

const library = new builder.Library('moreResults');

// More Results Dialog
library.dialog('/', [
    (session) => {
        console.log(`Cursor: ${session.userData.skip}, Count: ${session.userData.count}`);
        setTimeout(() => builder.Prompts.choice(session, 'What would you like to do next?', ['More Results', 'Bye']), 5000);
    },
    (session, results) => {
        if (results.response.entity === 'More Results' && session.userData.skip < session.userData.count) {
            session.beginDialog('nearbyRestaurants:/', session.userData.location, session.userData.skip)
        };
        if (results.response.entity === 'More Results' && session.userData.skip >= session.userData.count) {
            console.log('Cursor exceeds total count')
            session.endConversation('That\'s all I can find. Have a good day (:');
        };
        if (results.response.entity === 'Bye') {
            console.log('Ending conversation...');
            session.endConversation('Have a good day (:');
        };
    }
]);

module.exports = library;
