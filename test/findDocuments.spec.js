const MongoMock = require('mongomock');
const expect = require('chai').expect;
const findDocuments = require('../dist/lib/findDocuments');

var db = {
    fruits: [{name: 'Banana', price: 20}, {name: 'Apple', price: 10, tags: ['Africa', 'Turkey']}]
};
var mongo = new MongoMock(db);

describe('Get Documents', () => {
    it('should return the documents from a MongoDB collection', () => {
        findDocuments(mongo, 'fruits', { name: 'Banana' }, (docs) => {
            expect(docs).to.deep.equal([{name: 'Banana', price: 20}]);
        });
    });
});
