const SHA256 = require('crypto-js/sha256');
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
        return new this(Date.now(), "---", "This is the genesis block", "blah blah ");
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    returnBlock(){
        return ` Block is:
        timeStamp:      ${this.timeStamp}
        lastBlockHash:  ${this.lastBlockHash}
        thisBlockData:  ${this.thisBlockData}
        thisBlockHash:  ${this.thisBlockHash}
        Nonce:          ${this.nonce}
        Difficulty:     ${this.difficulty} `;
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
        const thisBlockHash = Block.hash(timeStamp, lastBlockHash, thisBlockData);
        return new this(timeStamp, lastBlockHash, thisBlockData, thisBlockHash);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }
    
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
          difficulty + 1 : difficulty - 1;
        return difficulty;
    }

}

module.exports = Block;