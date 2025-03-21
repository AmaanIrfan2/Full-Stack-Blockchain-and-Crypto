const Wallet= require('./index');
const { verifySignature } = require("../util");

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet= new Wallet();
    });

    it('has a `balance', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a `publicKey', () => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data', () =>{
        const data= 'foobar';

        it('verifies the signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true);
        });

        it('failed to verify the signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false);
        });  
    });
});