'use strict';

const builder = require('botbuilder');

const library = new builder.Library('moreResults');

// More Results Dialog TODO: store location for refine search
library.dialog('/', [
    (session) => {
        console.log(`Cursor: ${session.userData.cursor}, Count: ${session.userData.count}`);
        builder.Prompts.choice(session, 'What would you like to do next?', ['View More', 'Refine Search']);
    },
    (session, results) => {
        // Loop till user says bye or run out of results
        if (results.response.entity === 'View More' && session.userData.cursor < session.userData.count) {
            session.replaceDialog('getRestaurants:/')
        };
        if (results.response.entity === 'View More' && session.userData.cursor >= session.userData.count) {
            console.log('Cursor exceeds total count')
            console.log('Ending conversation...');
            session.endConversation('That\'s all I can find. Have a good day (:');
        };
        if (results.response.entity === 'Refine Search') {
            session.replaceDialog('getIntent:/')
        };
        if (results.response.entity === 'Bye') {
            console.log('Ending conversation...');
            session.endConversation('Have a good day (:');
        };
    }
]);

module.exports = library;
