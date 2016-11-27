'use strict';

const builder = require('botbuilder');

let createDeck = (session, tmpDeck, arr, numCards) => {
    arr.slice(0, numCards).forEach((result) => {
        let tmpCard = [
            new builder.HeroCard(session)
                .title(result.properties.name[0].text)
                .subtitle(`${result.properties.category[0].text}, ${result.properties.rating[0].text}, ${result.properties.address[0].text}`)
                .images([
                    builder.CardImage.create(session, result.properties.image[0].src)
                        .tap(builder.CardAction.showImage(session, result.properties.image[0].src))
                ])
                .buttons([
                    builder.CardAction.openUrl(session, result.properties.name[0].href, 'Reviews'),
                    builder.CardAction.openUrl(session, `https://www.google.com.sg/maps/dir/${session.userData.location.latitude},${session.userData.location.longitude}/${result.geometry.coordinates[1]},${result.geometry.coordinates[0]}`, 'Directions')
                ])
        ];
        tmpDeck.push(...tmpCard);
    });
    return tmpDeck;
}

module.exports = createDeck;
