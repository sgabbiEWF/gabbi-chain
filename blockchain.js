const Block = require("./block");

class BlockChain{
    constructor(){
        this.chain = [Block.Genesis()];
    }
    
    addBlock(data){
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(block);
        return this.chain, block;
    }
}

module.exports = BlockChain;