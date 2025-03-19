const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({blockchain}) {
        this.blockchain=blockchain;
        
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.publisher.connect();
        this.subscriber.connect();

        this.subscribeToChannels();
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel is ${channel}. Message is ${message}`);
    }

    subscribeToChannels(){
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel, (message) => {
                this.handleMessage(channel, message);
            });
        });
    }

    publish({channel, message}){
        this.publisher.publish(channel, message);
    }
}

(async () => {
    module.exports = PubSub;
})();