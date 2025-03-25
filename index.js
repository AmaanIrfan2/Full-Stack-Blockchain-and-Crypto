const bodyParser = require('body-parser');
 const express = require('express');
 const axios = require('axios');
 const TransactionPool= require('./wallet/transaction-pool');
 const Blockchain = require('./blockchain/index');
 const PubSub = require('./app/pubsub');
 const Wallet= require('./wallet');
 
 const app = express();
 const transactionPool = new TransactionPool();
 const blockchain = new Blockchain();
 const pubsub = new PubSub({ blockchain, transactionPool });
 const wallet = new Wallet();
 
 const DEFAULT_PORT = 3000;
 const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
 
 setTimeout(() => pubsub.broadcastChain(), 1000);
 
 app.use(bodyParser.json());
 
 app.get('/api/blocks', (req, res) => {
   res.json(blockchain.chain);
 });
 
 app.post('/api/mine', (req, res) => {
   const { data } = req.body;
 
   blockchain.addBlock({ data });
 
   pubsub.broadcastChain();
 
   res.redirect('/api/blocks');
 });

 app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ amount, recipient, transactionPool });
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);  

  pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});
 
 app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
 });

 const syncWithRootState = async () => {
  try {
    // Fetch blockchain state
    const { data: rootChain } = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);
    console.log('Replacing chain with', rootChain);
    blockchain.replaceChain(rootChain);
  } catch (error) {
    console.error('Error syncing chains:', error.message);
  }

  try {
    // Fetch transaction pool map
    const { data: rootTransactionPoolMap } = await axios.get(`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`);
    console.log('Replacing transaction pool map on sync with', rootTransactionPoolMap);
    transactionPool.setMap(rootTransactionPoolMap);
  } catch (error) {
    console.error('Error syncing transaction pool:', error.message);
  }
};
 
 let PEER_PORT;
 
 if (process.env.GENERATE_PEER_PORT === 'true') {
   PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
 }
 
 const PORT = PEER_PORT || DEFAULT_PORT;
 app.listen(PORT, () => {
   console.log(`listening at localhost:${PORT}`);
 
   syncWithRootState();
   if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
   }
 });