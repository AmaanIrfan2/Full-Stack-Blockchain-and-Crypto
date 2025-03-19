const hexToBinary = require('hex-to-binary');  
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

//defining a class
class Block {
    //constructor function to initialize a block
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty= difficulty;
    }
    //function for genesis block (static keyword means this function is called within same class and is not an instance)
    static genesis() {
        return new this (GENESIS_DATA);
    }
    //function for mining the Blocks
    static mineBlock({lastBlock, data}) {
        const lastHash= lastBlock.hash; //stores hash of the lastBlock as lastHash
        let hash, timestamp;
        let { difficulty } = lastBlock; //destructuring syntax { difficulty } extracts the difficulty property from lastBlock and assigns it to a new variable named difficulty
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty= Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash= cryptoHash(timestamp, difficulty, nonce, data, lastHash);
        } while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty));
        return new this ({timestamp, lastHash, data, difficulty, nonce, hash});
    }

    static adjustDifficulty({originalBlock, timestamp}){
        const { difficulty } = originalBlock;

        if (difficulty < 1) return 1;

        const difference = timestamp - originalBlock.timestamp;
      
        if(difference > MINE_RATE) return difficulty -1;
        return difficulty + 1;

    }
}

module.exports = Block;