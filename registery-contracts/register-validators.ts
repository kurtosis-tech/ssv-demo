// Define imports
import { ClusterScanner, NonceScanner } from 'ssv-scanner';
import { SSVKeys, KeyShares } from 'ssv-keys';
const operatorBatches = require('../data/operatorBatchesStage.json')
const accountsJSON = require('../data/accountDataStage.json')
const fs = require('fs')
const hre = require("hardhat");
const { ethers } = hre;

// Define global variables
let successCount = 0
let failureCount = 0
const sharesExpectedLength = 2626
const batchCount: any = process.env.BATCH_INDEX
const keystorePath = `/Users/andrew/Documents/keystores/JatoStage/ToRegister${batchCount}/`

// Build provider on the Goerli network
const provider = ethers.getDefaultProvider(process.env.RPC_URI)

// Build wallets from the private keys
let accounts = accountsJSON.validators.map(account => new ethers.Wallet(account.privateKey, provider))

// Define cluster param type
type clusterParams = {
    nodeUrl: any;
    contractAddress: any;
    ownerAddress: string;
    operatorIds: number[];
};

// Perform the cluster and nonce scanner functionality
async function getClusterAndNonce() {
    const params: clusterParams = {
        nodeUrl: process.env.RPC_URI,
        contractAddress: process.env.SSV_NETWORK_ADDRESS_STAGE,
        ownerAddress: accounts[batchCount].address,
        operatorIds: operatorBatches.IDs[batchCount],
    }
    const clusterScanner = new ClusterScanner(params)
    const cluster = await clusterScanner.run(params.operatorIds)
    const nonceScanner = new NonceScanner(params)
    const nonce = await nonceScanner.run()
    return { cluster, nonce }
}

// Start script
async function registerValidators() {

    // Attach SSV Network
    const ssvNetworkFactory = await ethers.getContractFactory('SSVNetwork')
    const ssvNetwork = ssvNetworkFactory.attach(process.env.SSV_NETWORK_ADDRESS_STAGE)
    console.log('Successfully Attached to the SSV Network Contract')

    // Approve accounts to the contract
    const ssvTokenFactory = await ethers.getContractFactory('SSVTokenMock')
    const ssvToken = ssvTokenFactory.attach(process.env.SSV_TOKEN_ADDRESS)
    console.log('Successfully Attached to the SSV Token Contract')
    const approveTX = await ssvToken.connect(accounts[batchCount]).approve(
        ssvNetwork.address,
        process.env.SSV_TOKEN_APPROVE_AMOUNT,
        {
            gasPrice: process.env.GAS_PRICE,
            gasLimit: process.env.GAS_LIMIT
        }
    )
    console.log(`Successfully Approved ${accountsJSON.validators[batchCount].name}`)
    await approveTX.wait()

    // Scan the cluster
    let data = await getClusterAndNonce()
    let nonce = data.nonce
    let podData = data.cluster.cluster
    let previousPodData = data.cluster.cluster

    // Build connection to the path of the keystores
    const dir = await fs.promises.opendir(keystorePath)

    // Get length of the keystores
    let keystoreLength = await fs.promises.readdir(keystorePath)

    // Loop through all the keystores and build their payloads
    for await (const keystoreFile of dir) {
        if (keystoreFile.name === '.DS_Store' || !keystoreFile.name.includes('.json')) {
            keystoreLength--
            continue
        }

        // Define the shares
        let shares = ''

        // Build the keystore path
        const keystoreData = require(keystorePath + keystoreFile.name)

        // Build the shares
        while (shares.length !== sharesExpectedLength) {
            // Step 1: read keystore file
            const ssvKeys = new SSVKeys();
            const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreData, process.env.KEYSTORE_PASSWORD);
            const operators = operatorBatches.publicKeys[batchCount].map((operatorPublicKeys: string, index: number) => ({
                id: operatorBatches.IDs[batchCount][index],
                publicKey: operatorPublicKeys
            }));

            // Step 2: Build shares from operator IDs and public keys
            const threshold = await ssvKeys.createThreshold(privateKey, operators);
            const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);

            // Step 3: Build final web3 transaction payload and update keyshares file with payload data
            const keyShares = new KeyShares();
            const builtPayload = await keyShares.buildPayload({
                publicKey,
                operators,
                encryptedShares,
            }, {
                ownerAddress: accounts[batchCount].address,
                ownerNonce: nonce,
                privateKey
            });
            shares = builtPayload.shares

            console.log('----------------------- register-validator -----------------------');
            console.log('public-key', publicKey);
            console.log('operator-ids', operatorBatches.IDs[batchCount]);
            console.log('pod-data', podData);
            console.log('ssv-nonce', nonce);
            console.log('------------------------------------------------------------------');

            // Connect the account to use for contract interaction
            const ssvNetworkContract = await ssvNetwork.connect(accounts[batchCount])

            // Register the validator
            const txResponse = await ssvNetworkContract.registerValidator(
                publicKey,
                operatorBatches.IDs[batchCount],
                shares,
                process.env.TOKEN_AMOUNT,
                podData,
                {
                    gasPrice: process.env.GAS_PRICE,
                    gasLimit: process.env.GAS_LIMIT
                }
            );
            console.log('tx', txResponse.hash, txResponse.nonce);

            try {
                // Get the pod data
                const receipt = await txResponse.wait();
                podData = (receipt.events[2].args[4]);
                if (podData !== previousPodData) {
                    nonce++
                    previousPodData = podData
                    successCount++
                    console.log(`${successCount} out of ${keystoreLength.length}: Successfully Registered Validator ${publicKey} to Batch ${operatorBatches.IDs[batchCount]}`)
                }
            } catch (error) {
                console.log(`${failureCount} out of ${keystoreLength.length}: Failed to register validator ${publicKey} to Batch ${operatorBatches.IDs[batchCount]}`)
                console.error(error);
                failureCount++
                // TODO - handle failed tx
            }
        }
    }
    // TODO - build and save a json output of all results
}

// Script initialization
registerValidators()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });