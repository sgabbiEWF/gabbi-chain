const Utilities = require('../utilities');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = Utilities.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    console.log("wallet created");
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    console.log("creating the transaction");
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceceds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain) {
    console.log("calculating balance");
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(Block => console.log(Block));
    blockchain.chain.forEach(Block => Block.thisBlockData.forEach(transaction => {
      transactions.push(transaction);
    }));

    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

    let startTime = 0;

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;