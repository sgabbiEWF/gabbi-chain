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
        return new this("Genesis time", "---", [], "This is a dummy hash for the genesis block", 0, DIFFICULTY);
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
        let hash, timestamp;
        const timeStamp = Date.now()
        const lastBlockHash = lastBlock.thisBlockHash;
        let {difficulty} = lastBlock;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastBlockHash, data, nonce, difficulty);
          } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        const thisBlockData = data;
        const thisBlockHash = this.hash(timeStamp, lastBlockHash, thisBlockData, nonce, difficulty);
        return new this(timeStamp, lastBlockHash, thisBlockData, thisBlockHash, nonce, difficulty);
    }

    static hash(timestamp, lastBlockHash, thisBlockData, nonce, difficulty) {
        return Utilities.hash(`${timestamp}${lastBlockHash}${thisBlockData}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timeStamp, lastBlockHash, thisBlockData, nonce, difficulty } = block;
        return Block.hash(timeStamp, lastBlockHash, thisBlockData, nonce, difficulty);
    }
    
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
          difficulty + 1 : difficulty - 1;
        return difficulty;
    }

}

module.exports = Block;