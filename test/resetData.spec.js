const expect = require('chai').expect;
const resetData = require('../dist/lib/resetData');

var session = {
    'userData': {
        'selector': 'some selector',
        'cursor': 'some cursor',
        'count': 'some count'
    }
};

// TODO:check that results are cleared
var results = { 'prop': 'some prop' };

describe('Reset Data', () => {
    it('should clear session properties', () => {
        resetData(session, results);
        console.log(results);
        expect(session).to.deep.equal({
            'userData': {
                'selector': {},
                'cursor': 0,
                'count': 0
            }
        });
    });
});
