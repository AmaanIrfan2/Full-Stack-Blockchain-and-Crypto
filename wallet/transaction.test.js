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
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toEqual(true);
        });
    });

    describe('validTransactions()', () => {
        let errorMock;

        beforeEach(()=>{
            errorMock= jest.fn();

            global.console.error = errorMock;
        });

        describe('when the transaction is valid', ()=>{
            it('returns true', ()=>{
                expect(Transaction.validTransactions(transaction)).toBe(true);
            });
        });
        
        describe('when the transaction is invalid', ()=>{
            describe('and the transaction output value is invalid', ()=>{
                it('returns false', () => {
                    transaction.outputMap[senderWallet.publicKey]=999999;

                    expect(Transaction.validTransactions(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the input signature is incorrect', ()=>{
                it('returns false', ()=>{
                transaction.input.signature= new Wallet().sign('data');

                expect(Transaction.validTransactions(transaction)).toBe(false);
                expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe('update()', () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

        describe('the amoutn is invalid', () => {
            it('throws an error', ()=>{
                expect( () => {
                    transaction.update({senderWallet, recipient: 'foo', amount: 999999})
                }).toThrow('Amount exceeds balance');
            });
        });

        describe('the amout is valid', () => {
            beforeEach( () =>{
                originalSignature= transaction.input.signature;
                originalSenderOutput= transaction.outputMap[senderWallet.publicKey];
                nextRecipient= 'next-recipient';
                nextAmount= 50;
    
                transaction.update({
                    senderWallet, recipient: nextRecipient, amount: nextAmount
                });
            });
    
            it('outputs the amount to the next recipient', ()=>{
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });
    
            it('substracts the amount from the original sender outout amount', ()=>{
                expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(originalSenderOutput-nextAmount);
            });
            
            it('maintains the total output that matches the input amount', () => {
                expect(
                Object.values(transaction.outputMap)
                .reduce((total, outputAmount) => total + outputAmount)
                ).toEqual(transaction.input.amount);
            });
    
            it('re-signs the transactions', ()=>{
                expect(transaction.input.signature).not.toEqual(originalSignature);
            }); 
            
            describe('add another update for the same recipient', ()=>{
                let addedAmount;

                beforeEach(() => {
                    addedAmount= 80;
                    transaction.update({
                        senderWallet, recipient: nextRecipient, amount: addedAmount
                    });
                });

                it('adds to the recipient amount', ()=>{
                    expect(transaction.outputMap[nextRecipient])
                    .toEqual(nextAmount + addedAmount);
                });

                it('substracts the amount from the original sender output amount', ()=> {
                    expect(transaction.outputMap[senderWallet.publicKey])
                        .toEqual(originalSenderOutput - nextAmount - addedAmount); 
                });
            });
        });     
    });
});