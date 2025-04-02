import React from "react";

const Transaction = ({ transaction }) => {
  if (!transaction || !transaction.input || !transaction.outputMap) {
    return <div className="Transaction">Invalid transaction data</div>;
  }

  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div className="Transaction">
      <div>
        <strong>From:</strong> {input.address ? `${input.address.substring(0, 20)}...` : "Unknown"} |
        <strong> Balance:</strong> {input.amount ?? "N/A"}
      </div>
      {recipients.map((recipient) => (
        <div key={recipient}>
          <strong>To:</strong> {recipient ? `${recipient.substring(0, 20)}...` : "Unknown"} |
          <strong> Sent:</strong> {outputMap[recipient] ?? "N/A"}
        </div>
      ))}
    </div>
  );
};

export default Transaction;
