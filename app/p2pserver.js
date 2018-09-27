// this gives the blockchain the ability to generate a server 
//to connect to other instances that identify themselves as peers

const Websocket = require("ws");
const P2P_PORT = process.env.P2P_PORT ? process.env.P2P_PORT : 5001;
const peers = process.env.peers ? process.env.peers.split(',') : []; 
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
  };
  
// HTTP_PORT=3001 P2P_PORT=5001 peers=ws://localhost:7001, ws://localhost:7002 

class P2pServer {
    constructor(blockchain, transactionPool){
        this.blockchain = blockchain;
        this.sockets = [];
        this.transactionPool = transactionPool;
    }

    listen() {
        // this will try to listen to open connections and listens to connect event 
        // once a connection comes executes the connect socket script.
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket)); 
        // socket object is returned in the call back 
        this.connectToPeers();
        console.log("listening for connections at "+ P2P_PORT);
    }

    connectToPeers() {
        peers.forEach(peer => {
        const socket = new Websocket(peer);
        socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log("socket connected")
        console.log(this.socket);
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type) {
              case MESSAGE_TYPES.chain:
                this.blockchain.replaceChain(data.chain);
                break;
              case MESSAGE_TYPES.transaction:
                this.transactionPool.updateOrAddTransaction(data.transaction);
                break;
              case MESSAGE_TYPES.clear_transactions:
                this.transactionPool.clear();
                break;
            }
        });
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
        console.log("the sent chain is:" + this.blockchain.chain);
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
          type: MESSAGE_TYPES.transaction,
          transaction
        }));
      }
    
    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
    
    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
          type: MESSAGE_TYPES.clear_transactions
        })));
    }
    

}
  module.exports = P2pServer;