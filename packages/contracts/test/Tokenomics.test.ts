import { expect } from "chai";
import { ethers } from "hardhat";
import { type Contract } from "zksync-ethers";
import { getAccount, getPublicClient, getWalletTipper, getWalletCreator, prepareWriteContract, getWallet } from "../deploy/utils";
import { Hex } from "viem";
import TechBitesContract from "../artifacts-zk/contracts/TechBites.sol/TechBites.json";
import TipManagerContract from "../artifacts-zk/contracts/TipManager.sol/TipManager.json";
import TokenManagerContract from "../artifacts-zk/contracts/TokenManager.sol/TokenManager.json";

describe("TechBites and TipManager", function () {
  let techBites: Contract;
  let tipManager: Contract;
  let tokenManager: Contract;
  let owner: any;
  let tipper: any;
  let creator: any;
  let techBitesAddress: string;
  let tipManagerAddress: string;
  let tokenManagerAddress: string;

  before(async function () {
    owner = getAccount(`${process.env.PRIVATE_KEY}`); 
    tipper = getAccount(`${process.env.TIPPER_PRIVATE_KEY}`);
    creator = getAccount(`${process.env.CREATOR_PRIVATE_KEY}`);
    techBitesAddress = `${process.env.TECH_BITES_CONTRACT_ADDRESS}`;
    tipManagerAddress = `${process.env.TIP_MANAGER_CONTRACT_ADDRESS}`;
    tokenManagerAddress = `${process.env.TOKEN_MANAGER_CONTRACT_ADDRESS}`;

    // Send tokens to tipper
    let request = await prepareWriteContract(
      owner, 
      techBitesAddress,
      TechBitesContract.abi,
      "transfer",
      [tipper.address, ethers.parseEther("1000")]
    );
    await getWallet().writeContract(request);
    
    request = await prepareWriteContract(
      owner, 
      techBitesAddress,
      TechBitesContract.abi,
      "approve",
      [`${tipManagerAddress}` as Hex, ethers.parseEther("1000")]
    );
    await getWallet().writeContract(request);
  });

  it("Should verify TipManager approval for TechBites tokens", async function () {
    const allowance = await getPublicClient().readContract({
      address: `${techBitesAddress}` as Hex,
      abi: TechBitesContract.abi,
      functionName: 'allowance',
      args: [owner.address, `${tipManagerAddress}` as Hex]
    });
    expect(allowance).to.equal(ethers.parseEther("1000"));
  });

  it("Should execute tip transaction correctly", async function () {
    // Get initial creator balance
    const initialCreatorBalance = BigInt(await getPublicClient().readContract({
      address: `${techBitesAddress}` as Hex,
      abi: TechBitesContract.abi,
      functionName: 'balanceOf',
      args: [creator.address]
    }) as unknown as string);

    // Approve spending
    let request = await prepareWriteContract(
      tipper, 
      techBitesAddress,
      TechBitesContract.abi,
      "approve",
      [`${tipManagerAddress}` as Hex, ethers.parseEther("1000")]
    );
    await getWalletTipper().writeContract(request);

    // Execute tip
    const tipAmount = ethers.parseEther("10");
    request = await prepareWriteContract(
      tipper,
      tipManagerAddress,
      TipManagerContract.abi,
      "tip",
      [creator.address, tipAmount, "post-123"]
    );
    await getWalletTipper().writeContract(request);

    // Get final creator balance
    const finalCreatorBalance = BigInt(await getPublicClient().readContract({
      address: `${techBitesAddress}` as Hex,
      abi: TechBitesContract.abi,
      functionName: 'balanceOf',
      args: [creator.address]
    }) as unknown as string);

    // Verify balance increase matches tip amount
    expect(finalCreatorBalance - initialCreatorBalance).to.equal(tipAmount);
  });

  it("Should allow claiming welcome reward", async function () {

    // Get initial creator balance
    const initialCreatorBalance = BigInt(await getPublicClient().readContract({
      address: `${techBitesAddress}` as Hex,
      abi: TechBitesContract.abi,
      functionName: 'balanceOf',
      args: [creator.address]
    }) as unknown as string);
  
    // Now claim welcome reward
    const { request } = await getPublicClient().simulateContract({
      account: owner,
      address: `${tokenManagerAddress}` as Hex,
      abi: TokenManagerContract.abi,
      functionName: "distributeReward",
      args: [creator.address]
    });

    await getWallet().writeContract(request);
  
    // Check new balances of creator supply
    const finalCreatorBalance = BigInt(await getPublicClient().readContract({
      address: `${techBitesAddress}` as Hex,
      abi: TechBitesContract.abi,
      functionName: 'balanceOf',
      args: [creator.address]
    }) as unknown as string);
  
    // Verify total supply increased
    expect(Number(finalCreatorBalance)).to.be.greaterThan(Number(initialCreatorBalance));
  });
});