const { GENESIS_DATA } = require('./config.js');
const cryptoHash = require('./crypto-hash.js');

//defining a class
class Block {
    //constructor function to initialize a block
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    //function for genesis block (static keyword means this function is called within same class and is not an instance)
    static genesis() {
        return new this (GENESIS_DATA);
    }
    //function for mining the Blocks
    static mineBlock({lastBlock, data, hash}) {
        const timestamp= Date.now(); //returns timestamp 
        const lastHash= lastBlock.hash; //stores hash of the lastBlock as lastHash
        return new this ({
            timestamp, 
            lastHash,
            data, //stores new transaction data
            hash: cryptoHash(lastHash, timestamp, data), //creates new hash for each new block
        });
    }
}

module.exports = Block;