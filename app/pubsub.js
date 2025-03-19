const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

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

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
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
}

module.exports = PubSub;