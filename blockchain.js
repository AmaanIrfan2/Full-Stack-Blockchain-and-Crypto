const Block = require('./block'); // Importing the Block class from block.js
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]; // Initializing the blockchain with the genesis block
    }

    addBlock({ data }) { 
        const newBlock = Block.mineBlock({ 
            lastBlock: this.chain[this.chain.length - 1], // Getting the last block in the chain
            data // Storing new transaction data
        });

        this.chain.push(newBlock); // Adding the newly mined block to the blockchain
    }

    static isValidChain(chain){

        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for( let i=1; i<chain.length; i++){
            const block= chain[i];
            const actualLastHash= chain[i-1].hash;
            const {timestamp, lastHash, hash, data} = block;

            if(lastHash !== actualLastHash) return false;

            const validatedHash= cryptoHash(timestamp, lastHash, data);

            if(hash!=validatedHash) return false;
        }
        return true;
    }
}
module.exports = Blockchain; // Exporting the Blockchain class for use in other files
