import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getAccount, getPublicClient, getWallet, prepareWriteContract } from "./utils";
import TechBitesContract from "../artifacts-zk/contracts/TechBites.sol/TechBites.json";
import TipManagerContract from "../artifacts-zk/contracts/TipManager.sol/TipManager.json";
import TokenManagerContract from "../artifacts-zk/contracts/TokenManager.sol/TokenManager.json";
import { ethers } from "ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  const account = getAccount(`${process.env.PRIVATE_KEY}`);
  //deploy the TechBites contract
  const techBitesReceipt = await deployContractFixture(hre, TechBitesContract, [account.address]);
  //deploy the TipManager contract
  const tipManagerReceipt = await deployContractFixture(hre, TipManagerContract, [techBitesReceipt.contractAddress, account.address]);
  //deploy the TokenManager contract
  const tokenManagerReceipt = await deployContractFixture(hre, TokenManagerContract, [techBitesReceipt.contractAddress, 25 * 10**18]);

  if (!tokenManagerReceipt.contractAddress) {
    throw new Error("TokenManager contract address is undefined");
  }

  if (!techBitesReceipt.contractAddress || !tokenManagerReceipt.contractAddress) {
    throw new Error("Contract addresses are undefined");
  }
  
  let request = await prepareWriteContract(
    account, 
    `${tokenManagerReceipt.contractAddress}`,
    TokenManagerContract.abi,
    "setAuthorizedCaller",
    [tokenManagerReceipt.contractAddress, true]
  );
  await getWallet().writeContract(request);
  console.log("TechBites approved TokenManager as an authorized caller");

  request = await prepareWriteContract(
    account, 
    `${techBitesReceipt.contractAddress}`,
    TechBitesContract.abi,
    "transfer",
    [tokenManagerReceipt.contractAddress, ethers.parseEther("500000")]
  );
  await getWallet().writeContract(request);
  console.log("TechBites transferred 500000 tokens to TokenManager");

  return [techBitesReceipt.contractAddress, tipManagerReceipt.contractAddress, tokenManagerReceipt.contractAddress];
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
