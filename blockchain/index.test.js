const Blockchain = require('./index'); // Importing the Blockchain class
const Block = require('./block'); // Importing the Block class
const cryptoHash= require('../util/crypto-hash');
describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });

    it('contains a `chain` array assurance', () => {
        expect(blockchain.chain instanceof Array).toBe(true); // Ensures that `chain` is an array
    });

    it('check if chain is starting from genesis', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis()); // Ensures the first block is the genesis block
    });

    it('adds a new block to the chain', () => {
        const newData = 'foobar'; // Sample data for the new block
        blockchain.addBlock({ data: newData }); // Adding a new block to the chain

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData); // Verifies the new block's data
    });

    describe('isValidChain()', () => {

        describe('the chain is not starting with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis' };

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('the chain is starting with the genesis block and has multiple blocks', () => {

            beforeEach(() => {
                blockchain.addBlock({ data: 'Bears' });
                blockchain.addBlock({ data: 'Beets' });
                blockchain.addBlock({ data: 'Battlestar Galactica' });
            });

            describe('and last hash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'broken-last-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the difficulty gets compromised', () =>{
                it('returns false', ()=>{
                    const lastblock= blockchain.chain[blockchain.chain.length-1];
                    const lastHash= lastblock.hash;
                    const timestamp= Date.now();
                    const nonce= 0;
                    const data= [];
                    const diffculty= lastblock.diffculty-3;
                    const hash= cryptoHash(lastHash, timestamp, nonce, data, diffculty);
                    const badBlock= new Block({lastHash, timestamp, nonce, data, diffculty});

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('chain contains a block witn an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'some-bad-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('chain is valid', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain', () => {
        describe('when the chain is not longer', () => {
            it('it does not replace the chain', () => {
                // modify the genesis block to make newChain invalid and hence smaller or equal chain does not replace blockchain.chain 
                newChain.chain[0] = { new: 'Chain' }; 
    
                blockchain.replaceChain(newChain.chain);
    
                expect(blockchain.chain).toEqual(originalChain);
            });
        });   

        describe('when the chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'Bears' });
                newChain.addBlock({ data: 'Beets' });
                newChain.addBlock({ data: 'Battlestar Galactica' });
            });
            describe('and the chain is invalid', () => {
                it('it does not replace the chain', () => {
                newChain.chain[2].hash = 'some-fake-hash'; //making the chain invalid

                blockchain.replaceChain(newChain.chain);
    
                expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe('and the chain is valid', () => {
                it('it does not replace the chain', () => {
                blockchain.replaceChain(newChain.chain); //replacing the chain with longest valid

                expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });
});
