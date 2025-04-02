import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./components/App";
import Blocks from "./components/Blocks";
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blocks" element={<Blocks />} />
            <Route path='/conduct-transaction' element={<ConductTransaction />} />
            <Route path='/transaction-pool' element ={<TransactionPool />} />
        </Routes>
    </Router>
);
