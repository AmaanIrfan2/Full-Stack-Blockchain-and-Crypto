import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

class Block extends Component {
  state = { displayTransaction: false };

  toggleTransaction = () => {
    this.setState((prevState) => ({ displayTransaction: !prevState.displayTransaction }));
  };

  get displayTransaction() {
    const { data = [] } = this.props.block; // Default to empty array
    const stringifiedData = JSON.stringify(data);
    const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;

    if (this.state.displayTransaction) {
      return (
        <div>
          {data.map((transaction) => (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button variant="danger" size="sm" onClick={this.toggleTransaction}>
            Show Less
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Data: {dataDisplay}</div>
        <Button variant="danger" size="sm" onClick={this.toggleTransaction}>
          Show More
        </Button>
      </div>
    );
  }

  render() {
    console.log("this.displayTransaction", this.displayTransaction);

    const { timestamp, hash } = this.props.block;
    const hashDisplay = hash ? `${hash.substring(0, 15)}...` : "N/A";

    return (
      <div className="Block">
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}</div>
        {this.displayTransaction}
      </div>
    );
  }
}

export default Block;