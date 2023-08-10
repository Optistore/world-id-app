import { useState, useEffect } from 'react';
import ContractData from '../contracts/ContractABI.json';

const useContract = (web3, contractAddress) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (web3) {
        const contract = new web3.eth.Contract(ContractData.abi, contractAddress);
        setContract(contract);
    }
  }, [web3, contractAddress]);

  return contract;
};

export default useContract;
