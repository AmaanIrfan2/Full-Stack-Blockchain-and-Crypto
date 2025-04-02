import React, { useState } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const ConductTransaction = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    const conductTransaction = () => {
        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        })
        .then(response => response.json())
        .then(json => {
            alert(json.message || json.type);
            navigate('/transaction-pool');
        });
    };

    return (
        <div className='ConductTransaction'>
            <Link to='/'>Home</Link>
            <h3>Conduct a Transaction</h3>
            <FormGroup>
                <FormControl
                    type='text'
                    placeholder='recipient'
                    value={recipient}
                    onChange={event => setRecipient(event.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <FormControl
                    type='number'
                    placeholder='amount'
                    value={amount}
                    onChange={event => setAmount(Number(event.target.value))}
                />
            </FormGroup>
            <div>
                <Button
                    bsStyle="danger"
                    onClick={conductTransaction}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default ConductTransaction;