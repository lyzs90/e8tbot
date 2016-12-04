'use strict';

const builder = require('botbuilder');
const request = require('request');

// Google Maps Geocoding API
const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

const library = new builder.Library('setLocation');

// Set Location Dialog
library.dialog('/', [
    (session, results) => {
        if (typeof results.response === 'undefined') {
            console.log('Failure: Invalid Choice');
            session.endConversation('You entered an invalid choice. Let\'s start over.');
        };
        console.log('Success: Received User Location');

        // Persist user location to session
        session.userData.location = results.response;

        // Reverse geocoding TODO: cache results
        let url = `${baseUrl}${session.userData.location.latitude},${session.userData.location.longitude}&key=${process.env.GOOGLE_GEOCODE_KEY}`;
        request(url, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                console.log('Success: Location reverse geocoded');
                let userAddress = JSON.parse(body).results[0].formatted_address;
                session.send(`Finding places near ${userAddress}...`);
            } else {
                console.log(err);
            }
        });

        // Persist selector to session TODO: add validation for selector
        session.userData.selector = {
            'geometry': {
                '$nearSphere': {
                    '$geometry': {
                        'type': 'Point',
                        'coordinates': [
                            session.userData.location.longitude, session.userData.location.latitude
                        ]
                    },
                    '$maxDistance': 1200
                }
            }
        };

        // Look for restaurants that meet the criteria
        session.replaceDialog('getRestaurants:/');
    }
]);

module.exports = library;
