import React from 'react';

const ConnectButton = ({ onConnect }) => {
  return (
    <button onClick={onConnect}>
      Connect Wallet
    </button>
  );
};

export default ConnectButton;
