import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { type Contract } from "zksync-ethers";
import { getAccount, getPublicClient, getWallet, prepareWriteContract } from "../deploy/utils";
import { Hex } from "viem";
import ScoreManagerContract from "../artifacts-zk/contracts/ScoreManager.sol/ScoreManager.json";

describe("ScoreManager", function () {
  let scoreManager: Contract;
  let owner: any;
  let creator: any;
  let scoreManagerAddress: string;

  before(async function () {
    owner = getAccount(`${process.env.PRIVATE_KEY}`);
    creator = getAccount(`${process.env.CREATOR_PRIVATE_KEY}`);
    scoreManagerAddress = `${process.env.SCORE_MANAGER_CONTRACT_ADDRESS}`;
  });

  it("Should register a new post", async function () {
    const request = await prepareWriteContract(
      owner,
      scoreManagerAddress,
      ScoreManagerContract.abi,
      "registerWrittenPost",
      [creator.address]
    );
    await getWallet().writeContract(request);

    const stats = await getPublicClient().readContract({
      address: scoreManagerAddress as Hex,
      abi: ScoreManagerContract.abi,
      functionName: 'getCreatorStats',
      args: [creator.address]
    });

    expect((stats as any[])[0]).to.equal(1n); // posts count
  });

  it("Should register a tip", async function () {
    const request = await prepareWriteContract(
      owner,
      scoreManagerAddress,
      ScoreManagerContract.abi,
      "registerTip",
      [creator.address, ethers.parseEther("10"), "post-123"]
    );
    await getWallet().writeContract(request);

    const stats = await getPublicClient().readContract({
      address: scoreManagerAddress as Hex,
      abi: ScoreManagerContract.abi,
      functionName: 'getCreatorStats',
      args: [creator.address]
    });

    expect((stats as any[])[1]).to.equal(1n); // tips count
    expect((stats as any[])[2]).to.equal(ethers.parseEther("10")); // amount tipped
  });

  it("Should register a like", async function () {
    const request = await prepareWriteContract(
      owner,
      scoreManagerAddress,
      ScoreManagerContract.abi,
      "registerLike",
      [creator.address, "post-123"]
    );
    await getWallet().writeContract(request);

    const stats = await getPublicClient().readContract({
      address: scoreManagerAddress as Hex,
      abi: ScoreManagerContract.abi,
      functionName: 'getCreatorStats',
      args: [creator.address]
    });

    expect((stats as any[])[3]).to.equal(1n); // likes count
  });


  it("Should verify totalAmountTipped value", async function () {
    const stats = await getPublicClient().readContract({
      address: scoreManagerAddress as Hex,
      abi: ScoreManagerContract.abi,
      functionName: 'getCreatorStats',
      args: [creator.address]
    });

    console.log("Total amount tipped (Wei):", (stats as any[])[2]);
    console.log("Total amount tipped (ETH):", Number((stats as any[])[2]) / 1e18);
    
    // Verify the amount is 10 ETH in Wei
    expect((stats as any[])[2]).to.equal(ethers.parseEther("10"));
  });

    it("Should calculate correct score with detailed components", async function () {
    const stats = await getPublicClient().readContract({
      address: scoreManagerAddress as Hex,
      abi: ScoreManagerContract.abi,
      functionName: 'getCreatorStats',
      args: [creator.address]
    });

    // Calculate expected values
    const postsScore = BigInt((stats as any[])[0]);
    const tipsScore = BigInt((stats as any[])[1]) * 10n;
    const amountScore = BigInt(Number((stats as any[])[2]) / 1e18 / 10);
    const likesScore = BigInt((stats as any[])[3]) * 5n;
    const expectedTotal = postsScore + tipsScore + amountScore + likesScore;

    console.log("Component Breakdown:");
    console.log("Posts Score:", postsScore.toString());
    console.log("Tips Score:", tipsScore.toString());
    console.log("Amount Score:", amountScore.toString());
    console.log("Likes Score:", likesScore.toString());
    console.log("Expected Total:", expectedTotal.toString());

    // Score = Posts(1) + Tips(1*10) + AmountTipped(10*0.1) + Likes(1*5)
    // Score = 1 + 10 + 1 + 5 = 17
    expect(expectedTotal).to.equal(17n);
  });
});