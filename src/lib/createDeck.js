'use strict';

const builder = require('botbuilder');

let createDeck = (session, tmpDeck, docs, numCards, callback) => {
    let arr = callback(docs);
    console.log('Success: Array Shuffled');
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
                    builder.CardAction.openUrl(session, result.properties.name[0].href, 'Reviews')
                ])
        ];
        tmpDeck.push(...tmpCard);
    });
}

module.exports = createDeck;
