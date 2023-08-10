import { useState, useEffect } from 'react';
import Web3 from 'web3';

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      web3Instance.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      });
    }
  }, []);

  return { web3, address };
};

export default useWeb3;
