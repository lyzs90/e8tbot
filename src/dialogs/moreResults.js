'use strict';

const builder = require('botbuilder');

const library = new builder.Library('moreResults');

// More Results Dialog
library.dialog('/', [
    (session) => {
        console.log(`Cursor: ${session.userData.skip}, Count: ${session.userData.count}`);
        builder.Prompts.choice(session, 'What would you like to do next?', ['More Results', 'Bye']);
    },
    (session, results) => {
        // Loop till user says bye or run out of results
        if (results.response.entity === 'More Results' && session.userData.skip < session.userData.count) {
            session.replaceDialog('nearbyRestaurants:/')
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
