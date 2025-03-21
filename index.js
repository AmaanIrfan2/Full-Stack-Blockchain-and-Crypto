const bodyParser = require('body-parser');
 const express = require('express');
 const axios = require('axios');
 const Blockchain = require('./blockchain/index');
 const PubSub = require('./app/pubsub');
 
 const app = express();
 const blockchain = new Blockchain();
 const pubsub = new PubSub({ blockchain });
 
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
 
 const syncChains = async () => {
    try {
      const { data: rootChain } = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);
      console.log('Replacing chain with', rootChain);
      blockchain.replaceChain(rootChain);
    } catch (error) {
      console.error('Error syncing chains:', error.message);
    }
  };
 
 let PEER_PORT;
 
 if (process.env.GENERATE_PEER_PORT === 'true') {
   PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
 }
 
 const PORT = PEER_PORT || DEFAULT_PORT;
 app.listen(PORT, () => {
   console.log(`listening at localhost:${PORT}`);
 
   syncChains();
   if (PORT !== DEFAULT_PORT) {
     syncChains();
   }
 });