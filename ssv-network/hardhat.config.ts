import 'dotenv/config';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-tracer';
import '@nomiclabs/hardhat-solhint';
import 'hardhat-contract-sizer';
import 'hardhat-storage-layout-changes';

var local_rpc_uri = process.env.RPC_URI || "http://127.0.0.1:9650/ext/bc/C/rpc"

task("accounts", "Prints the list of accounts", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  accounts.forEach((account: SignerWithAddress): void => {
    console.log(account.address)
  })
})

task("balances", "Prints the list of ETH account balances", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  for(const account of accounts){
    const balance: BigNumber = await hre.ethers.provider.getBalance(
        account.address
    );
    console.log(`${account.address} has balance ${balance.toString()}`);
  }
})

const config: HardhatUserConfig = {
  // Your type-safe config goes here
  mocha: {
    timeout: 40000000000000000
  },
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },
  networks: {
    ganache: {
      chainId: 1337,
      url: "http://127.0.0.1:8585"
    },
    hardhat: {
      allowUnlimitedContractSize: true
    },
    localnet: {
      url: local_rpc_uri,
      // These are private keys associated with prefunded test accounts created by the eth-network-package
      // https://github.com/kurtosis-tech/eth-network-package/blob/main/src/prelaunch_data_generator/genesis_constants/genesis_constants.star
      accounts: [
        "ef5177cd0b6b21c87db5a0bf35d4084a8a57a9d6a064f86d51ac85f2b873a4e2",
        "48fcc39ae27a0e8bf0274021ae6ebd8fe4a0e12623d61464c498900b28feb567",
        "7988b3a148716ff800414935b305436493e1f25237a2a03e5eebc343735e2f31",
        "b3c409b6b0b3aa5e65ab2dc1930534608239a478106acf6f3d9178e9f9b00b35",
        "df9bb6de5d3dc59595bcaa676397d837ff49441d211878c024eabda2cd067c9f",
        "7da08f856b5956d40a72968f93396f6acff17193f013e8053f6fbb6c08c194d6",
        "17fdf89989597e8bcac6cdfcc001b6241c64cece2c358ffc818b72ca70f5e1ce",
      ],
      allowUnlimitedContractSize: true
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 0.3
  }
};

if (process.env.GOERLI_ETH_NODE_URL) {
  //@ts-ignore
  config.networks.goerli = {
    url: process.env.GOERLI_ETH_NODE_URL,
    accounts: [`0x${process.env.GOERLI_OWNER_PRIVATE_KEY}`],
    gasPrice: +(process.env.GAS_PRICE || ''),
    gas: +(process.env.GAS || '')
  };
}

if (process.env.MAINNET_ETH_NODE_URL) {
  //@ts-ignore
  config.networks.mainnet = {
    url: process.env.MAINNET_ETH_NODE_URL,
    accounts: [`0x${process.env.MAINNET_OWNER_PRIVATE_KEY}`],
    gasPrice: +(process.env.GAS_PRICE || ''),
    gas: +(process.env.GAS || '')
  };
}

export default config;
