'use strict';

import builder from 'botbuilder';
import Promise from 'bluebird';
import request from 'request';
const requestAsync = Promise.promisify(request);

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

        // Reverse geocoding TODO: cache results
        let url = `${baseUrl}${session.userData.location.latitude},${session.userData.location.longitude}&key=${process.env.GOOGLE_GEOCODE_KEY}`;
        requestAsync(url)
            .then((res) => {
                console.log('Success: Location reverse geocoded');
                let userAddress = JSON.parse(res.body).results[0].formatted_address;
                return session.send(`Finding places near ${userAddress}...`);
            })
            .then(() => {
                // Look for restaurants that meet the criteria
                return session.replaceDialog('getRestaurants:/');
            })
            .catch((err) => {
                console.log('Failure: Invalid location');
                throw err;
            })
    }
]);

module.exports = library;
