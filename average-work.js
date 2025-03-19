const Blockchain = require('./blockchain');  

const blockchain = new Blockchain();  
blockchain.addBlock({ data: 'initial' });
console.log('first block is', blockchain.chain[blockchain.chain.length-1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average; // Variables to track timestamps, block details, and time differences

const times = []; // Array to store time taken to mine each block

// Loop to add blocks to the blockchain
for (let i = 0; i < 10000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp; // Get the timestamp of the last block

    blockchain.addBlock({ data: `block ${i}` }); // Mine a new block with some data

    nextBlock = blockchain.chain[blockchain.chain.length - 1]; // Get the newly mined block
    nextTimestamp = nextBlock.timestamp; // Get its timestamp

    timeDiff = nextTimestamp - prevTimestamp; // Calculate the time taken to mine the block
    times.push(timeDiff); // Store the mining time in the array

    // Calculate the average mining time across all blocks mined so far
    average = times.reduce((total, num) => (total + num)) / times.length;

    // Print the mining time, difficulty of the new block, and the average mining time
    console.log(`Time to mine block ${timeDiff}. Difficulty: ${nextBlock.difficulty}. Average time: ${average} `);
}
