const express = require('express');
const blockChain = require("../blockchain/blockchain.js");
const block = require("../blockchain/block.js");
const P2pServer = require('./p2pserver');
const HTTP_PORT = process.env.HTTP_PORT || 3001;  
const bodyParser = require('body-parser');

const app = express();
const bc = new blockChain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
	res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const blockData = bc.addBlock(req.body.data);
    p2pServer.syncChains();
    res.redirect('/blocks');
    console.log("block added and sync sent to peers");
})

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pServer.listen();

