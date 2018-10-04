const Utilities = require('../utilities.js');
const {DIFFICULTY, MINE_RATE} = require('../config.js');

class Block{
    constructor(timeStamp, lastBlockHash, thisBlockData, thisBlockHash, nonce, difficulty ){
        this.timeStamp = timeStamp;
        this.lastBlockHash = lastBlockHash;
        this.thisBlockData = thisBlockData; 
        this.thisBlockHash = thisBlockHash;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY; 
        }

    static Genesis(){
        return new this("Genesis time", "---", ["blah"], "This is a dummy hash for the genesis block", 0, DIFFICULTY);
    }

    toString(){
        return ` Block is:
        timeStamp:      ${this.timeStamp}
        lastBlockHash:  ${this.lastBlockHash}
        thisBlockHash:  ${this.thisBlockHash}
        Nonce:          ${this.nonce}
        Difficulty:     ${this.difficulty} 
        thisBlockData:  ${this.thisBlockData} `;
    }

    static mineBlock(lastBlock, data){
        let hash, timeStamp;
        //console.log("the last block is: " + lastBlock);
        const lastBlockHash = lastBlock.thisBlockHash;
        //console.log('thisBlockHash of last block is: ' + lastBlockHash);
        let {difficulty} = lastBlock;
        let nonce = 0;
        do {
            nonce++;
            timeStamp = Date.now();
            difficulty = this.adjustDifficulty(lastBlock, timeStamp);
            hash = this.hash(timeStamp, lastBlockHash, data, nonce, difficulty);
          } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        const thisBlockData = data;
        //console.log("values used for calculating this hash are: " + timeStamp + lastBlockHash + thisBlockData + nonce + difficulty);
        const thisBlockHash = this.hash(timeStamp, lastBlockHash, thisBlockData, nonce, difficulty);
        //console.log("sending hash of this block is: " + thisBlockHash);
        return new this(timeStamp, lastBlockHash, thisBlockData, thisBlockHash, nonce, difficulty);
    }

    static hash(timeStamp, lastBlockHash, thisBlockData, nonce, difficulty) {
        return Utilities.hash(`${timeStamp}${lastBlockHash}${thisBlockData}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timeStamp, lastBlockHash, thisBlockData, nonce, difficulty } = block;
        //console.log("these are the hashed values below from the block class");
        //console.log(timeStamp + lastBlockHash + thisBlockData + nonce + difficulty);
        //console.log("their hashed value is:" + Block.hash(timeStamp, lastBlockHash, thisBlockData, nonce, difficulty));

        return Block.hash(timeStamp, lastBlockHash, thisBlockData, nonce, difficulty);
    }
    
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        if(lastBlock.timestamp + MINE_RATE > currentTime){
            console.log("increasing difficulty block time is faster than mine rate: " + difficulty);
            difficulty = difficulty + 1;
        }
        else if((lastBlock.timestamp + MINE_RATE <= currentTime) && (difficulty>1)){
            console.log("decreasing difficulty to 1:  " + difficulty);
            difficulty - 1;
        }
        else{
            difficulty = 1;
        }
        return difficulty;
    }

}

module.exports = Block;