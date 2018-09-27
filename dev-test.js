const Block = require("./blockchain/block");
const BlockChain = require("./blockchain/blockchain");
let blockChainInstance = new BlockChain();

console.log(Block.hash(1538055023043,'0455100fd7d139f122058839f931ec8e14793c4860457bc7c9bffffb8ec735be', 'blahdata from 3002', 1, 3));
