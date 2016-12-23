'use strict';

import builder from 'botbuilder';
import resetData from '../lib/resetData';

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
const model = `https://api.projectoxford.ai/luis/v1/application?id=\
${process.env.LUIS_ID}&subscription-key=${process.env.LUIS_SUB_KEY}`;
const recognizer = new builder.LuisRecognizer(model);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

const library = new builder.Library('getIntent');

// Intents Dialog
library.dialog('/', intents);

intents.onBegin((session, results) => {
    // Reset results before dialog begins
    resetData(session, results);
    if (results.response !== 'Exception') {
        session.send('Sure, what would you like to eat today?');
    } else {
        session.send('Please specify a type of food, cuisine or restaurant.');
    }
});

// Respond to answers like 'no', 'bye', 'goodbye', 'thank you'
intents.matches('SayBye', [
    (session, args) => {
        console.log('Ending conversation...');
        session.endConversation('Alright, let me know if you need anything else.');
    }
]);

// Respond to answers like 'i hate <food>', 'don't want to eat <food>'
intents.matches('SomethingElse', [
    (session, args) => {
        let task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
        setTimeout(() => session.send(`Ah, something other than ${task.entity}?`), 2000);
        session.beginDialog('getIntent:/');
    }
]);

// Respond to answers containing <food> <cuisine> <location> <restaurant> TODO: multiple entity searches
intents.matches('FindNearby', [
    (session, args) => {
        console.log('Success: Listening for Intent');
        console.log(args.entities);

        if (args.entities && args.entities.length !== 0) {
            let task = builder.EntityRecognizer.findEntity(args.entities, 'Food') || builder.EntityRecognizer.findEntity(args.entities, 'Cuisine') || builder.EntityRecognizer.findEntity(args.entities, 'Location');
            session.send(`Searching for... ${task.entity}`);
            console.log(task.entity);

            // Persist selector to session TODO: add validation for selector
            session.userData.selector = {
                'properties.name.0.text': {
                    '$regex': `^.*${task.entity}.*$`,
                    '$options': 'i'
                }
            }

            // Look for restaurants that meet the criteria
            session.replaceDialog('getRestaurants:/');
        } else {
            // Main error handler
            session.send('Sorry, I couldn\'t find anything. Do you want to try something else?');
            let results = {response: 'Exception'};
            session.beginDialog('getIntent:/', results);
        }
    }

]);

module.exports = library;
