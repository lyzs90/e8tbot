const expect = require('chai').expect;
const createDeck = require('../dist/lib/createDeck');

let tmpDeck = [];

describe("Create Deck", () => {
    it("should slice an array, do something then return another array", () => {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        arr.slice(0, 5).forEach( (result) => {
            let tmpCard = [result + 1];
            tmpDeck.push(...tmpCard);
        });
        expect(tmpDeck).to.deep.equal([2, 3, 4, 5, 6]);
    });
});
