import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import useContract from '../hooks/useContract';
import ConnectButton from '../components/ConnectButton';
import { IDKitWidget } from '@worldcoin/idkit';

import { decodeAbiParameters } from 'viem'



const Home = () => {
    const { web3, address } = useWeb3();
    const contractAddress = "0x58C388bb71Ff2a926963cf888Cd793De700d6E9e";
    const contract = useContract(web3, contractAddress);
    const [details, setDetails] = useState('');
    const [inputDetails, setInputDetails] = useState('');

    const [isConnected, setIsConnected] = useState(false);


 

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
            setIsConnected(true); // Set isConnected to true here
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert('Failed to connect to MetaMask. Please ensure it is installed and active.');
        }
    };
    

    return (
        <div>
            <ConnectButton onConnect={handleConnect} />
            <IDKitWidget
                app_id="app_staging_bac8f2183c543501eb06f7a73282fdf4"
                action="claim_nft"
                signal={address}
                onSuccess={onSuccess}
                credential_types={['orb']}
                enableTelemetry
                useSimulator
            >
                {({ open }) => (
                    <button 
                        onClick={() => {
                            if (isConnected) {
                                open();
                            } else {
                                alert('You need to be connected to proceed.');
                            }
                        }}
                        disabled={!isConnected} // Disable the button if not connected
                    >
                        Create Optistore Profile 
                    </button>
                )}
            </IDKitWidget>
            <div>
                <h2>Contract Details:</h2>
                <p>{details}</p>
            </div>

        </div>
    );
};

export default Home;
