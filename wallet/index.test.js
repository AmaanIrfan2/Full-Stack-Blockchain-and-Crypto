const Transaction = require('./transaction');
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

    describe('createTransaction()', ()=> {
        describe('amount exceeds the balance', ()=> {
            it('throws an error', () =>{
                expect(() => wallet.createTransaction({ amount: 999999, recipient: 'foo-recipient'}))
                .toThrow('Amount exceeds balance');
            });
        });

        describe('amount is valid', ()=>{
            let amount, transaction, recipient;

            beforeEach(() =>{    
                amount= 50;
                recipient= 'foo-recipient';
                transaction= wallet.createTransaction({amount, recipient});
            });

            it('creates an instance of transaction', ()=>{
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction with the input wallet', ()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount to the recepient', ()=>{
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });

        });
    });
});