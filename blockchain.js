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

    isChainValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.Genesis())) return false;
        for (let i=1; i<chain.length; i++) {
          const block = chain[i];
          const lastBlock = chain[i-1];
          if (
            block.lastHash !== lastBlock.hash ||
            block.hash !== Block.blockHash(block)
          ) {
            return false;
          }
        }
        return true;
      }

    replaceChain(chain) {
        if(!(this.isChainValid(chain)) && this.chain.length> chain.length){
            this.chain = chain;
            console.log("chain cannot be replaced ");
        } 
        else{
            console.log("this chain is not worth replacing");
        }
    }
}

module.exports = BlockChain;