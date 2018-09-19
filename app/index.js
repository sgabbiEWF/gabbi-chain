const express = require('express');
const blockChain = require("../blockchain/blockchain.js");
const block = require("../blockchain/block.js");
const HTTP_PORT = process.env.HTTP_PORT || 3001;  
const bodyParser = require('body-parser');
const app = express();
const bc = new blockChain();
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
	res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    console.log(req.body.data);
    const blockData = bc.addBlock(req.body.data);
    res.redirect('/blocks');
})

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));

