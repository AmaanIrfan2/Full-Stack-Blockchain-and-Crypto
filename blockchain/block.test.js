const hexToBinary = require('hex-to-binary');
const Block = require('./block'); //This line imports the Block class from block.js
const { GENESIS_DATA, MINE_RATE } = require('../config'); 
const {cryptoHash} = require('../util');

describe('Block', () => { //describe() is a function provided by Jest, 'Block' is like a string for identification, and () => creates the function

    //These lines create variables to store expected values, and the values are dummy values 
    const timestamp = 2000;
    const lastHash = 'lastHash';
    const hash = 'hash';
    const data = ['blockchain', 'data'];
    const nonce= 1;
    const difficulty= 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty }); //This line creates a new block using the Block class.


    //it is a jest fnction, the line is a string for description, and then main logic in function 
    it('has a timestamp, lastHash, hash, and data property', () => {

        //Each line compares a property of block with the expected value, if it matches- pass, else fails the test
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
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
            .toEqual(cryptoHash(
                minedBlock.timestamp, 
                minedBlock.nonce, 
                minedBlock.difficulty, 
                lastBlock.hash, 
                data));
        });

        it('sets the `hash` that matches the hash diffculty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults= [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty', () => {
        it('raises the difficulty for a quickly mined block', ()=> {
            expect(Block.adjustDifficulty({originalBlock: block, 
                timestamp: block.timestamp + MINE_RATE - 100})).toEqual(block.difficulty+1);
        });

        it('decreases the difficulty for a slowly mined block', ()=> {
            expect(Block.adjustDifficulty({originalBlock: block, 
                timestamp: block.timestamp + MINE_RATE + 100})).toEqual(block.difficulty-1);
        });

        it('has a lower limit of 1', ()=>{
            block.difficulty= -1;

            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        });
    });
});