require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@matterlabs/hardhat-zksync");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  zksolc: {
    version: "latest",
    settings: {},
  },
  networks: {
    // ...

    lensTestnet: {
      chainId: 37111,
      ethNetwork: "sepolia",
      url: "https://rpc.testnet.lens.dev",
      verifyURL:
        "https://block-explorer-verify.testnet.lens.dev/contract_verification",
      zksync: true,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },

    hardhat: {
      zksync: true,
    },
  },
  etherscan: {
    apiKey: '6J51DB27K1QJJQ6JBU2DZGVJD5AFQVAHQV', // Required if you want to verify on Ethereum
  },
};
