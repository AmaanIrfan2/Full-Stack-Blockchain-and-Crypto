const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
  constructor({ blockchain, transactionPool }) {
    this.blockchain = blockchain;
    this.transactionPool= transactionPool;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.publisher.connect().catch(err => console.error('Redis Publisher Error:', err));
    this.subscriber.connect().catch(err => console.error('Redis Subscriber Error:', err));

    this.subscribeToChannels();
  }

  async subscribeToChannels() {
    for (const channel of Object.values(CHANNELS)) {
      await this.subscriber.subscribe(channel, (message) => {
        this.handleMessage(channel, message);
      });
    }
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);

    switch (channel){
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({
            chain: parsedMessage
          });
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
      default:
        return;
    }
  }

  async publish({ channel, message }) {
    if (!this.publisher.isOpen) {
      await this.publisher.connect();
    }
    await this.publisher.publish(channel, message);
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction){
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

module.exports = PubSub;