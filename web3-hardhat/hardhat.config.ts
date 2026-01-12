import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@matterlabs/hardhat-zksync";

const ACCOUNTS = process.env.DEPLOYER_ACCOUNT_PRIV_KEY
  ? [`${process.env.DEPLOYER_ACCOUNT_PRIV_KEY}`]
  : [];

module.exports = {
  defaultNetwork: "hardhat",
  gasReporter: {
    enabled: false,
  },
  networks: {
    hardhat: { zksync: true, },
    lensTestnet: {
      chainId: 37111,
      ethNetwork: "sepolia",
      url: "https://rpc.testnet.lens.dev",
      verifyURL:
        "https://block-explorer-verify.testnet.lens.dev/contract_verification",
      zksync: true,
      accounts: ACCOUNTS,
    },
  },
  etherscan: {
    apiKey: {

    },
    customChains: [

    ],
  },
  sourcify: {
    enabled: false,
  },
  zksolc: {
    version: "latest",
    settings: {},
  },
  solidity: {
    version: "0.8.26",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
