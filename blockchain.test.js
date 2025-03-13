const Blockchain = require('./blockchain'); // Importing the Blockchain class
const Block = require('./block'); // Importing the Block class

describe('Blockchain', () => { 
    let blockchain;
    
    beforeEach(()=>{
        blockchain= new Blockchain(); 
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

    describe('isValidChain()', () =>{

        describe('the chain is not starting with the genesis block', ()=>{
            it ('returns false', ()=>{
                blockchain.chain[0]= { data : 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('the chain is starting with the genesis block and has multiple blocks', ()=>{

            beforeEach(()=>{
                blockchain.addBlock({ data: 'Bears'});
                blockchain.addBlock({ data: 'Beets'});
                blockchain.addBlock({ data: 'Battlestar Galactica'});
            });

            describe('and last hash reference has changed', ()=>{
                it ('returns false', ()=>{                
                    blockchain.chain[2].data = 'broken-last-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('chain contains a block witn an invalid field', () => {
                it ('returns false', ()=>{
                    blockchain.chain[2].data = 'some-bad-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('chain is valid', ()=>{
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});
