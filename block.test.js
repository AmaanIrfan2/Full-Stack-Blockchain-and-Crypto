const Block = require('./block'); //This line imports the Block class from block.js
const { GENESIS_DATA } = require('./config'); 
const cryptoHash = require('./crypto-hash');

describe('Block', () => { //describe() is a function provided by Jest, 'Block' is like a string for identification, and () => creates the function

    //These lines create variables to store expected values, and the values are dummy values 
    const timestamp = 'a-date';
    const lastHash = 'lastHash';
    const hash = 'hash';
    const data = 'data';
    const block = new Block({ timestamp, lastHash, hash, data }); //This line creates a new block using the Block class.


    //it is a jest fnction, the line is a string for description, and then main logic in function 
    it('has a timestamp, lastHash, hash, and data property', () => {

        //Each line compares a property of block with the expected value, if it matches- pass, else fails the test
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });

    //testing the genesis block
    describe('Genesis', () => {   

        const genesisBlock = Block.genesis(); //calling genesis() from Block file
        it('returns block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true); //checks if the genesisBlock is the instance of Block class
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA); //checks if genesisBlock has exactly same data as GENESIS_DATA
        });
    });

    //testing the mining of the block
    describe('mineBlock', () => {
        const lastBlock = Block.genesis();
        const data = 'block data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a block instance', () => {
            expect(minedBlock instanceof Block).toBe(true); //checks if the minedBlock is the instance of Block class
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toBe(lastBlock.hash); 
        });

        it('sets the `data`', () =>{
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates valid SHA256 based on valid inputs', () => {
            expect(minedBlock.hash)
            .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });
    });
});