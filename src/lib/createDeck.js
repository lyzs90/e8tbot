var builder = require('botbuilder');
var shuffleArray = require('../lib/shuffleArray');

var createDeck = (session, tmpDeck, docs) => {
    var arr = shuffleArray(docs[0].results);
    arr.slice(0, 5).forEach( (result) => {
        var tmpCard = [
            new builder.HeroCard(session)
                .title(result.Name[0].text)
                .subtitle(`${result.Category[0].text}, ${result.Rating[0].text}`)
                .text(`\n${result.Address[0].text}`)
                .images([
                    builder.CardImage.create(session, result.Image[0].src)
                        .tap(builder.CardAction.showImage(session, result.Image[0].src)),
                ])
                .buttons([
                    builder.CardAction.openUrl(session, result.Image[0].href, "Reviews")
                ])
        ];
        tmpDeck.push(...tmpCard);
    });
}

module.exports = createDeck;
