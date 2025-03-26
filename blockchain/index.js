const Block = require('./block'); // Importing the Block class from block.js
const {cryptoHash} = require('../util');
const Transaction = require('../wallet/transaction');
const Wallet= require('../wallet');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

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

    replaceChain(chain, validateTransactions, onSuccess){
        if(chain.length <= this.chain.length){ //if the new blockchain (chain) is not longer than the current one (this.chain) it rejects 
            console.error('The chain is not longer');
            return;
        }

        if(!Blockchain.isValidChain(chain)) { //Calls a function Blockchain.isValidChain(chain) to verify if the new chain is valid
            console.error('The chain is not valid');
            return;
        }

        if (validateTransactions && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid data');
            return;
          }
      
        if (onSuccess) onSuccess();
        
        console.log('Replacing the chain'); 
        this.chain=chain; //chain gets replaced
    }

    validTransactionData({ chain }) {
        for (let i=1; i<chain.length; i++) {
          const block = chain[i];
          const transactionSet = new Set();
          let rewardTransactionCount = 0;
    
          for (let transaction of block.data) {
            if (transaction.input.address === REWARD_INPUT.address) {
              rewardTransactionCount += 1;
    
              if (rewardTransactionCount > 1) {
                console.error('Miner rewards exceeds limit');
                return false;
              }
    
              if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                console.error('Miner reward amount is invalid');
                return false;
              }
            } else {
              if (!Transaction.validTransactions(transaction)) {
                console.error('Invalid transaction');
                return false;
              }
              const trueBalance = Wallet.calculateBalance({
                chain: this.chain,
                address: transaction.input.address
              });
    
              if (transaction.input.amount !== trueBalance) {
                console.error('Invalid input amount');
                return false;
              }

              if (transactionSet.has(transaction)) {
                console.error('An identical transaction appears more than once in the block');
                return false;
              } else {
                transactionSet.add(transaction);
              }
            }
          }
        }
    
        return true;
      }

    static isValidChain(chain){

        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for( let i=1; i<chain.length; i++){
            const {timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];
            const actualLastHash= chain[i-1].hash;
            const lastDifficulty= chain[i-1].difficulty;

            if(lastHash !== actualLastHash) return false;

            const validatedHash= cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if(hash!=validatedHash) return false;

            if((lastDifficulty-difficulty) > 1) return false;
        }
        return true;
    }
}
module.exports = Blockchain; // Exporting the Blockchain class for use in other files
