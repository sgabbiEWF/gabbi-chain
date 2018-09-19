// this gives the blockchain the ability to generate a server 
//to connect to other instances that identify themselves as peers

const Websocket = require("ws");
const P2P_PORT = process.env.P2P_PORT ? process.env.P2P_PORT : 5001;
const peers = process.env.peers ? process.env.peers.split(',') : []; 
// HTTP_PORT=3001 P2P_PORT=5001 peers=ws://localhost:7001, ws://localhost:7002 

class P2pServer {
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets = [];
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
    }

    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log('data', data);
            this.blockchain.replaceChain(this.blockchain.chain);
        })
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }
    
    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket));
    }

}
  module.exports = P2pServer;