class TransactionPool{
    constructor() {
        this.transactionMap= {};
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id]= transaction;
    }

    setMap(transactionMap){
        this.transactionMap=transactionMap;
    }

    existingTransaction({ inputAddress }) {
        return Object.values(this.transactionMap).find(
            transaction => transaction.input && transaction.input.address === inputAddress
        );
    }    
}

module.exports= TransactionPool;