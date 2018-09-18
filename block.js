const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(timeStamp, lastBlockHash, thisBlockData, thisBlockHash){
        this.timeStamp = timeStamp;
        this.lastBlockHash = lastBlockHash;
        this.thisBlockData = thisBlockData; 
        this.thisBlockHash = thisBlockHash;
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
        thisBlockData:      ${this.thisBlockData}
        thisBlockHash:  ${this.thisBlockHash} `;
    }

    static mineBlock(lastBlock, data){
        const timeStamp = Date.now()
        const lastBlockHash = lastBlock.thisBlockHash;
        const thisBlockData = data;
        const thisBlockHash = Block.hash(timeStamp, lastBlockHash, thisBlockData);
        return new this(timeStamp, lastBlockHash, thisBlockData, thisBlockHash);
    }


}

module.exports = Block;