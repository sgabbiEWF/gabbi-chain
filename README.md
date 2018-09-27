# gabbi-chain

Implementing a blockchain with a consensus algorithm and custom tokens and wallet objects. 

Purely for experimental purposes. 

to work with: 

1. git clone https://github.com/sgabbiEWF/gabbi-chain.git 
2. npm install 
3. npm run dev 

This should open a client on port 3001 and a p2p server on port 5001. 

to run another client run: HTTP_PORT=3002 P2P_PORT=5002 peers=ws://localhost:5001 npm run dev

this should show that the socket has enabled p2p communication between the 2 nodes and they are ready to send data, fake_coins etc.. 

