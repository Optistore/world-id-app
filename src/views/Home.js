import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import useContract from '../hooks/useContract';
import ConnectButton from '../components/ConnectButton';
import { IDKitWidget } from '@worldcoin/idkit';

import { decodeAbiParameters } from 'viem'



const Home = () => {
    const { web3, address } = useWeb3();
    const contractAddress = "0x171ecb7e761c9fe5c2337b92b878b4ad209c95ac";
    const contract = useContract(web3, contractAddress);
    const [details, setDetails] = useState('');
    const [inputDetails, setInputDetails] = useState('');


 

    const onSuccess = async (data) => {
        console.log("Verification successful:", data);
        try {
            const accounts = await web3.eth.getAccounts();
            
            // Ensure the proof is an array of numbers before decoding
            // const abiCoder = new AbiCoder();
            const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], data.proof)[0]
            
            console.log("Address:", address);
            console.log("Unpacked Proof:", unpackedProof);

            // Ensure the unpackedProof is an array before sending it to the contract
            if (Array.isArray(unpackedProof)) {
                await contract.methods.verifyAndExecute(address, data.merkle_root, data.nullifier_hash, unpackedProof).send({ from: accounts[0] });
            } else {
                console.error("Unpacked proof is not in the expected format.");
            }
      
        } catch (error) {
            console.error("Error sending proof to contract:", error);
        }
    };
    

    const handleConnect = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            alert('Connected to MetaMask!');
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert('Failed to connect to MetaMask. Please ensure it is installed and active.');
        }
    };

    return (
        <div>
            <ConnectButton onConnect={handleConnect} />
            <IDKitWidget
                app_id="app_staging_25625bb1e6992d263be894cd28235705" // must be an app set to on-chain
                action="claim_nft"
                signal={address}
                onSuccess={onSuccess}
                credential_types={['orb']}
                enableTelemetry
                useSimulator
            >
                {({ open }) => <button onClick={open}>Verify with World ID</button>}
            </IDKitWidget>
            <div>
                <h2>Contract Details:</h2>
                <p>{details}</p>
            </div>

        </div>
    );
};

export default Home;
