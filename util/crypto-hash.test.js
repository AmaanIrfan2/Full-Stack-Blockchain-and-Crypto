const cryptoHash= require('./crypto-hash');

describe('cryptoHash()', () => { //cryptoHash is written with parenthesis because test name is same as function
    it ('generates SHA256 hashed output', () => {
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
    });

    it ('produces the same hash with same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });

    it ('produces a unique hash when properties are changed on an input', () => {
        const foo= {};
        const originalHash= cryptoHash(foo);
        foo ['a']= 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});