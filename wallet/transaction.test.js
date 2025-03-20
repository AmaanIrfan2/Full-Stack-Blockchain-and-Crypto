const Transaction= require('./transaction');
const Wallet= require('./index');
const { verifySignature } = require('../util');

describe('transactions', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(()=>{
        senderWallet= new Wallet();
        amount= 50;
        recipient= 'recipient-public-key';
        transaction= new Transaction({senderWallet, recipient, amount});
    });

    it('has an `id', () => {
        expect(transaction).toHaveProperty("id");
    });

    describe('outputMap', () => {
        it('has an `outputMap`', ()=>{
            expect(transaction).toHaveProperty("outputMap");
        });

        it('outputs the amount to the recipient', ()=>{
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('outputs the remaining balance to the `senderWallet', ()=>{
            expect(transaction.outputMap[senderWallet.publicKey])
            .toEqual(senderWallet.balance-amount);
        });
    });

    describe('input', ()=>{
        it('has an `input`', ()=>{
            expect(transaction).toHaveProperty('input');
        });

        it('has a `timestamp` in the input', ()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('set the `amount` to the `senderWallet` balance', ()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the `address` to the `senderWallet` public key', ()=>{
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('signs the input', ()=>{
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.inputMap,
                    signature: transaction.input.signature
                })
            ).toEqual(true);
        });
    });
});