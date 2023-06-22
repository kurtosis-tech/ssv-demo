gyani
gyani#6361
Lior [SSV.Network | BloxStaking], Andrew [ssv.network | Blox], Derek | Kurtosis, galen, y0sher [ SSV.Network ], Moshe [Blox Staking] & [SSV], mieubrisse

y0sher [ SSV.Network ] — 06/04/2023 3:37 PM
Hi @gyani , our dev guide describes creating the events.yaml file, we should probably add there that this file is a debugging and testing env replacement for actually reading the events from the contract. So in the regular env what will happen is that operators will be registered to the contract using their operator keys, then validators will deposit ETH stake and register to the contract as validators in SSV and choose 4 (or more but we can focus on this case at first) operators to run their duties.
and then the node reads the contract events using an ETH EL node.
gyani — 06/05/2023 4:01 PM
Interesting! And as we’re deploying the contract we don’t need to do this step? Based on the existing code base do we just have to go from 1 to 4 nodes then?
y0sher [ SSV.Network ] — 06/06/2023 8:03 AM
Well yeah this should work. Also we might not even need bootnode as discovery with mdns might work here.
Derek | Kurtosis
 added 
galen
 to the group.
 — 06/06/2023 4:07 PM
gyani — 06/06/2023 4:08 PM
So the first node can be the boot node while the other 3 can read from it; should be enough! Got it. Will get you something soon.
y0sher [ SSV.Network ] — 06/06/2023 5:30 PM
Maybe this also is not needed. I'm pretty sure we have discovery by mdns, that should work in a dockerized environment
Just like Ethereum
gyani — 06/06/2023 7:10 PM
^ so with a recent change I can start 4 number of nodes; they all run and connect to ethereum. Should I be seeing some chatter between them?
https://github.com/kurtosis-tech/ssv-demo/pull/6/files
^ these were the changes I made to get to 4 nodes
GitHub
start 4 nodes by h4ck3rk3y · Pull Request #6 · kurtosis-tech/ssv-de...
Image
https://app.circleci.com/pipelines/github/kurtosis-tech/ssv-demo/32/workflows/e5d28b6f-61fa-4bf9-8e0e-924ac7bf7720/jobs/38
^ this is what the output of kurtosis run looks like https://app.circleci.com/pipelines/github/kurtosis-tech/ssv-demo/32/workflows/e5d28b6f-61fa-4bf9-8e0e-924ac7bf7720/jobs/38
Do the logs make sense? Should I be seeing chatter between the nodes? 
gyani — 06/06/2023 8:12 PM
I haven't made any mdns configuration changes; i am hoping they can just discover each other
gyani — 06/06/2023 8:31 PM
@y0sher [ SSV.Network ]  i am now starting the first node with start-boot-node and the other nodes I start with start-node ; in the other nodes configuration i pass the ip off the first node mimicing https://github.com/bloxapp/ssv/blob/2fb5cff5820757daf5d93f182e40a95bc9d130ec/config/config.example.yaml#L31-L33 I am not sure what to put for the private key 
Image
Image
https://app.circleci.com/pipelines/github/kurtosis-tech/ssv-demo/37/workflows/182875cc-4112-492e-9847-44c1c1e3e5a9/jobs/44
^ this is waht the run looks like
Image
Image
https://github.com/kurtosis-tech/ssv-demo/pull/7
^ this is the branch I am working off at the moment
GitHub
created bootnode configuration by h4ck3rk3y · Pull Request #7 · kur...
Image
gyani — 06/08/2023 8:29 AM
Hey @y0sher [ SSV.Network ] I am curious if you got a chance to try the above ^
y0sher [ SSV.Network ] — 06/08/2023 8:44 AM
Will take a look at it in a few
Lior [SSV.Network | BloxStaking] — 06/08/2023 9:25 AM
Hi @gyani,
a node can’t run as a node and a boot node.

here is my suggestion,
if the nodes run on the same server then use mdns by adding in config:
Image
regarding operator privatekey,
please check the guide:
https://docs.ssv.network/run-a-node/operator-node/
Operator Node
Basically you need to generate the private key first and then provide it using the config
gyani — 06/08/2023 5:52 PM
@Lior [SSV.Network | BloxStaking] They will run on different containers but have a shared interface! I can add the p2p config! Alright so 
I will generate keys per node at the moment I was using a generated value and copying it over nodes. This has to be unique per node I am guessing? Or can I have the same operator key accross nodes? I just copied one of your example PK/SK pairs.
You wrote that a node cannot be a node and a boot node; in my code I've made the 1st node the boot node and the others nodes. Is that okay? The bootnode configuration seems to require two things - ExternalIP and PrivateKey. For the external IP I can provide the private key of the 1st node? What do I provide for the private key here? Does a bootnode require any special configuration?
It seems like every node I start needs to be registered as well - I have to call the registerOperator (publicKey, operatorFee) from every node as everynode if every node has its own private key. Is that correct?
Image
Derek | Kurtosis — 06/08/2023 6:30 PM
Hello @Lior [SSV.Network | BloxStaking]& @y0sher [ SSV.Network ] ! First, thank you both for iterating with us as we try to get the ssv-demo package into a state where its usable for your team. 

Would one of you (or Moshe) be open to hopping on a call for an hour next week to get the last bits of SSV-specific logic added to the package?  We can teach & ramp you guys up on the Kurtosis concepts and Starlark, but need help with the SSV side of things. A call would help @gyani get the context much faster and speed things up. Here's our Calendly with some slots friendly to your timezone: https://calendly.com/kurtosis/call-with-kurtosis-derek-gyani 
Derek | Kurtosis — 06/08/2023 6:47 PM
Otherwise, we know you guys are busy with the upcoming release of your first mainnet candidate and so we can engage in the future too. We want to be respectful of your time and priorities!

While we're more than happy to help you guys on-board and get started, we are a small startup and have existing, active users we'd like to support. You know where to find us if you're still open to chatting 🙂 
Lior [SSV.Network | BloxStaking] — 06/08/2023 6:54 PM
Thanks, let’s schedule something next week
gyani — 06/08/2023 7:22 PM
Thank you @Lior [SSV.Network | BloxStaking] ! Looking forward to speaking 🙂
Lior [SSV.Network | BloxStaking] — 06/11/2023 4:35 PM
scheduled
gyani — 06/13/2023 11:13 AM
Looking forward to it 🙂
Derek | Kurtosis — 06/19/2023 3:04 PM
Hey folks! Are we still having our call today? @y0sher [ SSV.Network ] @Lior [SSV.Network | BloxStaking] ?
y0sher [ SSV.Network ] — 06/19/2023 3:06 PM
Hi guys, sorry it seems like @Lior [SSV.Network | BloxStaking] and @Moshe [Blox Staking] & [SSV] are unavailable, we might need to reschedule
Derek | Kurtosis — 06/19/2023 3:08 PM
Okay, no worries! Would any of these slots work for a re-schedule? https://calendly.com/kurtosis/call-with-kurtosis-derek-gyani 

Let me know if not, I can move stuff around for us. @y0sher [ SSV.Network ]
Calendly
Call with Kurtosis (Derek & Gyani) - Kurtosis
Calendly for a chat with Kurtosis. Derek (PM) and Gyani (Engineer) will be attending!
Image
Lior [SSV.Network | BloxStaking] — 06/19/2023 3:16 PM
@Derek | Kurtosis can we do it now?
so sorry we couldn't join on time
Derek | Kurtosis — 06/19/2023 3:21 PM
Oh yeah, sure we can hop back on! Give me a sec to find a phone booth again
Lior [SSV.Network | BloxStaking] — 06/19/2023 3:23 PM
joining
gyani — 06/19/2023 3:34 PM
https://github.com/kurtosis-tech/eth-network-package/tree/main/src/el
GitHub
eth-network-package/src/el at main · kurtosis-tech/eth-network-pack...
A Kurtosis package that spins up a local Ethereum testnet - eth-network-package/src/el at main · kurtosis-tech/eth-network-package
eth-network-package/src/el at main · kurtosis-tech/eth-network-pack...
gyani — 06/19/2023 4:23 PM
@Lior [SSV.Network | BloxStaking] @Moshe [Blox Staking] & [SSV] @y0sher [ SSV.Network ] It was fun chatting. From the call there were a few FLUPs for you guys
Can you send me examples of registerOperator ,registerValidators and the key tool key splitting/encryption. I believe you said there's some automation/code that's already written. If I can see that then I can implement it in Kurtosis
We discussed how eth2.Network for now( bloxstaking/ssv-node:latest image) can be set to prater/pyrmont/mainnet. It seems like recently there's been some work to change it to mainnet, jato-v2-stage, jato-v2. I am for now passing prater and that might lead to some limitations; and we want to be able to pass testnet etc.


I'll be creating an issue for 2 on your GH. Do you think its worth me doing the registerOperator / registerValidator work while I am only able to set prater?
https://github.com/bloxapp/ssv/issues/1025
GitHub
Add the ability to pass in networks other than `mainnet, prater, py...
Is your feature request related to a problem? Please describe. I am using the docker image bloxstaking/ssv-node:latest to create ssv nodes. It seems like for the configuration I can only pass in py...
Add the ability to pass in networks other than `mainnet, prater, py...
Lior [SSV.Network | BloxStaking]
 added 
Andrew [ssv.network | Blox]
 to the group.
 — 06/20/2023 8:42 AM
Lior [SSV.Network | BloxStaking] — 06/20/2023 8:44 AM
Hi @Andrew [ssv.network | Blox] ,
Do we have an example script we can share with @gyani 

for register operator and register validator (that uses ssv keys) from keystore?
gyani — Yesterday at 4:04 PM
Hey @Andrew [ssv.network | Blox] ^ pinging you again about the above 🙂
Andrew [ssv.network | Blox] — Yesterday at 4:29 PM
Hey @gyani sorry for the wait on this i would be glad to share some scripts that i whipped together.  Please keep in mind these are not production grade and need a lot of work to be added to them to handle errors and exact flows that you might want to achieve etc... 

I am using hardhat to deploy these scripts, some of the things here might not be fully understandable as the comments are not great and some other things are needed such as the actual contracts to compile and build abi, jsons of operators ids, keystores etc... Please let me know if you have any question regarding structure of a json, an import etc... and i would be glad to help
// Define imports
const operatorBatches = require('../data/newOperators.json')
const accountsJSON = require('../data/accountDataStage.json')
const hre = require("hardhat");
const { ethers } = hre;
import * as dotenv from 'dotenv'
Expand
register-operators-stage.ts
3 KB
// Define imports
import { ClusterScanner, NonceScanner } from 'ssv-scanner';
import { SSVKeys, KeyShares } from 'ssv-keys';
const operatorBatches = require('../data/operatorBatchesStage.json')
const accountsJSON = require('../data/accountDataStage.json')
const fs = require('fs')
Expand
register-validators-stage.ts
7 KB
gyani — Yesterday at 4:36 PM
Thanks Andrew! This looks useful 🙂  I have just skimmed through the code and it makes sense to me so far. If I run into any pitfalls I'll reach out to you 🙂 . I'll probably go dive deep into it tomorrow morning London time and will have questions for you by later in the day if I run into troubles
Andrew [ssv.network | Blox] — Yesterday at 4:36 PM
sounds great!  Have fun and let me know if i can help
gyani — Yesterday at 4:37 PM
Is this in a public repository somewhere? I can copy the package-lock.json as well if it is 😅
Andrew [ssv.network | Blox] — Yesterday at 4:39 PM
yeah so its not public and i figured we would get to a package.json 🙂 .  This is from a folder of personal scripts that i whipped together when needed and package.json is a bit large.  I will send what i have but there might be a bit there that is unnecessary
{
  "name": "ssv-network",
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^1.0.6",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.8",
    "@nomicfoundation/hardhat-toolbox": "^2.0.0",
Expand
package.json
2 KB
﻿
// Define imports
import { ClusterScanner, NonceScanner } from 'ssv-scanner';
import { SSVKeys, KeyShares } from 'ssv-keys';
const operatorBatches = require('../data/operatorBatchesStage.json')
const accountsJSON = require('../data/accountDataStage.json')
const fs = require('fs')
const hre = require("hardhat");
const { ethers } = hre;
import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

// Define global variables
let successCount = 0
let failureCount = 0
const sharesExpectedLength = 2626
const batchCount: any = process.env.BATCH_INDEX
const keystorePath = `/Users/andrew/Documents/keystores/JatoStage/ToRegister${batchCount}/`

// Build provider on the Goerli network
const provider = ethers.getDefaultProvider(process.env.ETH1_URL)

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
        nodeUrl: process.env.ETH1_URL,
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
register-validators-stage.ts
7 KB