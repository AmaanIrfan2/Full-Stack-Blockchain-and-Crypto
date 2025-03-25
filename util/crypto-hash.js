const crypto = require('crypto'); // imports Node.js's built-in crypto module to generate secure hashes

const cryptoHash = (...inputs) =>{ //(...inputs) means it accepts any number of arguments
    const hash= crypto.createHash('sha256'); //for implementing sha256 algorithm 

    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' ')); //joins all the input in one string separated by spaces 

    return hash.digest('hex'); //converts hashed data into readable hexadecimal string
};

module.exports = cryptoHash;