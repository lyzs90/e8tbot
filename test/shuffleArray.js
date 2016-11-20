const expect = require('chai').expect;
const seedrandom = require('seedrandom');
const shuffleArray = require('../dist/lib/shuffleArray');

describe("Shuffle Array", () => {
    it("should randomly shuffle an array", () => {
        seedrandom('testseed', { global: true });
        let arr = [1, 2, 3, 4, 5];
        expect(shuffleArray(arr)).to.deep.equal([1, 4, 2, 5, 3]);
    });
});
