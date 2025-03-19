//This code is creating a simple blockchain API using Express.js

const express= require('express'); //library to create web servers easily 
const Blockchain= require('./blockchain');
const bodyParser= require('body-parser');

const blockchain= new Blockchain();
const app= new express();

//Allows the server to handle JSON data in requests
app.use(bodyParser.json());

//API Endpoint to Get All Blocks
app.get('/api/blocks', (req, res) => {  
    res.json(blockchain.chain);
});

//API Endpoint to Add a New Block
app.post('/app/mine', (req, res) => {
    const {data} = req.body; // Extract data sent in the request

    blockchain.addBlock({data}); //Add a new block to the blockchain

    res.redirect('/api/blocks'); //Redirect the user to see the updated blockchain
});
const PORT= 3000; //port on localhost 

app.listen(PORT, () => console.log(`listening to the localhost ${PORT}`));