import React, { Component } from "react";
import { Link } from 'react-router-dom';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then((response) => response.json())
            .then((json) => this.setState({ walletInfo: json }))
            .catch((error) => console.error("Error fetching wallet info:", error));
    }

    render() {
        const { address = "N/A", balance = "N/A" } = this.state.walletInfo;

        return (
            <div className="App">
                <div><strong style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome to the blockchain...</strong></div>
                <br />
                <div><Link to='./blocks'> Blocks </Link></div>
                <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                <br />
                <div className="WalletInfo">
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;
