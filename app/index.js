const express = require('express');
const Blockchain = require("../blockchain/blockchain.js");
const P2pServer = require('./p2pserver');
const bodyParser = require('body-parser');
const Miner = require("./miner");
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;  

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);


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

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
  });

app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    console.log(recipient, amount);
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    console.log("transaction pool executed");
    console.log(transaction);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pServer.listen();

