const cryptoHash= require('./crypto-hash');

describe('cryptoHash()', () => { //cryptoHash is written with parenthesis because test name is same as function
    it ('generates SHA256 hashed output', () => {
        expect(cryptoHash('foo')).toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
    });

    it ('produces the same hash with same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });
});