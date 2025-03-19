const INITITAL_DIFFICULTY= 3;
const MINE_RATE= 1000;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    nonce: 0,
    difficulty: INITITAL_DIFFICULTY,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE};
