import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getAccount, getPublicClient, getWallet } from "./utils";
import ScoreManagerContract from "../artifacts-zk/contracts/ScoreManager.sol/ScoreManager.json";

export default async function (hre: HardhatRuntimeEnvironment) {
  const account = getAccount(`${process.env.PRIVATE_KEY}`);
  
  const scoreManagerReceipt = await deployContractFixture(hre, ScoreManagerContract, [account.address]);

  return [scoreManagerReceipt.contractAddress];
}

async function deployContractFixture(hre: HardhatRuntimeEnvironment, Contract: any, args: any[] = []) {
  const { contractName, abi, bytecode } = Contract;

  const wallet = getWallet();
  const account = getAccount(`${process.env.PRIVATE_KEY}`);
  const hash = await wallet.deployContract({
    abi,
    account: account,
    args: args,
    bytecode: bytecode as `0x${string}`,
  });

  const receipt = await getPublicClient().waitForTransactionReceipt({ hash });

  console.log(`
  🚀 ${contractName} successfully deployed:
  📄 Contract Address: ${receipt.contractAddress}
  🔗 Transaction Hash: ${receipt.transactionHash}
  🌐 Network: ${hre.network.name}
  `);

  return receipt;
}