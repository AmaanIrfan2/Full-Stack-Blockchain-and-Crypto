const Transaction = require('./transaction');

class TransactionPool{
    constructor() {
        this.transactionMap= {};
    }

    clear(){
        this.transactionMap= {};
    };

    clearBlockchainTransactions({chain}){
        for(let i=1; i<chain.length; i++){
            const block= chain [i];

            for(let transaction of block.data){
                if(this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
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
    
    validTransactions() {
        return Object.values(this.transactionMap).filter(
          transaction => Transaction.validTransactions(transaction)
        );
    }
}

module.exports= TransactionPool;