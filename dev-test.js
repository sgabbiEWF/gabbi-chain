const Block = require("./block");
const BlockChain = require("./blockchain");
let blockChainInstance = new BlockChain();

console.log(blockChainInstance.chain[0]);

blockChainInstance.addBlock("blah blah");
blockChainInstance.addBlock("blah blah blah");
console.log(JSON.stringify(blockChainInstance.chain[0]));
console.log(JSON.stringify(Block.Genesis()));
console.log(blockChainInstance.isChainValid(blockChainInstance.chain));