import { expect } from "chai";
import * as hre from "hardhat";
import { type Contract, type Wallet } from "zksync-ethers";
import { getWallet, LOCAL_RICH_WALLETS, deployContract } from "../deploy/utils";
import { getContractFactory } from "@nomicfoundation/hardhat-ethers/types";
import { ethers } from "ethers";

describe("Game Mechanics", function () {
  const owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
  const player = getWallet(LOCAL_RICH_WALLETS[1].privateKey);

  let strengthToken: Contract;
  let intelligenceToken: Contract;
  let vitalityToken: Contract;
  let attributeMinter: Contract;
  let wethToken: Contract;
  beforeEach(async function () {
    wethToken = await deployContract("WETH", [], {
      wallet: owner,
      silent: true,
    });

    // Impersonate the WETH whale account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8"],
    });

    const wethWhale = await hre.ethers.getSigner("0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8");
    
    // Transfer WETH from whale to owner
    await wethToken.connect(wethWhale).transfer(owner.address, ethers.parseEther("10"));

    // Stop impersonating
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: ["0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8"],
    });

    strengthToken = await deployContract(
      "AttributeToken",
      ["Strength Token", "Agent-STR", 1000],
      {
        wallet: owner,
        silent: true,
      }
    );
    intelligenceToken = await deployContract(
      "AttributeToken",
      ["Intelligence Token", "Agent-INT", 1000],
      {
        wallet: owner,
        silent: true,
      }
    );
    vitalityToken = await deployContract(
      "AttributeToken",
      ["Vitality Token", "Agent-VIT", 1000],
      {
        wallet: owner,
        silent: true,
      }
    );
    // Deploy the attribute minter
    attributeMinter = await deployContract(
      "AttributeMinter",
      [
        await wethToken.getAddress(),
        await strengthToken.getAddress(),
        await intelligenceToken.getAddress(),
        await vitalityToken.getAddress(),
      ],
      {
        wallet: owner,
        silent: true,
      }
    );
  });

  describe("Attribute Token Distribution", function () {
    it("Should initialize tokens with correct names and symbols", async function () {
      expect(await strengthToken.name()).to.equal("Strength Token");
      expect(await strengthToken.symbol()).to.equal("Agent-STR");

      expect(await intelligenceToken.name()).to.equal("Intelligence Token");
      expect(await intelligenceToken.symbol()).to.equal("Agent-INT");

      expect(await vitalityToken.name()).to.equal("Vitality Token");
      expect(await vitalityToken.symbol()).to.equal("Agent-VIT");
    });

    it("Should allow owner to distribute attribute tokens to player", async function () {
      const initialOwnerBalance = await strengthToken.balanceOf(owner.address);

      // Transfer some tokens to the player
      await strengthToken.connect(owner).transfer(player.address, 100);
      await intelligenceToken.connect(owner).transfer(player.address, 50);
      await vitalityToken.connect(owner).transfer(player.address, 75);

      // Check player's balances
      expect(await strengthToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance - 100n
      );
      expect(await strengthToken.balanceOf(player.address)).to.equal(100);
      expect(await intelligenceToken.balanceOf(player.address)).to.equal(50);
      expect(await vitalityToken.balanceOf(player.address)).to.equal(75);
    });

    it("Should emit Transfer events when distributing attributes", async function () {
      await expect(strengthToken.connect(owner).transfer(player.address, 100))
        .to.emit(strengthToken, "Transfer")
        .withArgs(owner.address, player.address, 100);

      await expect(
        intelligenceToken.connect(owner).transfer(player.address, 50)
      )
        .to.emit(intelligenceToken, "Transfer")
        .withArgs(owner.address, player.address, 50);

      await expect(vitalityToken.connect(owner).transfer(player.address, 75))
        .to.emit(vitalityToken, "Transfer")
        .withArgs(owner.address, player.address, 75);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      // Get player's token instance
      const playerStrengthToken = strengthToken.connect(player);

      // Try to transfer more tokens than the player has
      await expect(
        playerStrengthToken.transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");
    });
  });

  describe("Attribute Minter", function () {
    it("Should allow staking WETH for attribute tokens", async function () {
      const playerMinter = attributeMinter.connect(player);
      const wethAmount = 1000n; // 1 WETH
      // Give player some WETH
      await wethToken.connect(owner).transfer(player.address, wethAmount);
      await wethToken
        .connect(player)
        .approve(await attributeMinter.getAddress(), wethAmount);

      // Stake WETH for attributes
      await expect(playerMinter.stakeAndMint(400, 300, 300))
        .to.emit(strengthToken, "Transfer")
        .withArgs(await attributeMinter.getAddress(), player.address, 400)
        .to.emit(intelligenceToken, "Transfer")
        .withArgs(await attributeMinter.getAddress(), player.address, 300)
        .to.emit(vitalityToken, "Transfer")
        .withArgs(await attributeMinter.getAddress(), player.address, 300);

      // Verify balances
      expect(await strengthToken.balanceOf(player.address)).to.equal(400);
      expect(await intelligenceToken.balanceOf(player.address)).to.equal(300);
      expect(await vitalityToken.balanceOf(player.address)).to.equal(300);
    });

    it("Should allow withdrawing WETH by burning attribute tokens", async function () {
      const playerMinter = attributeMinter.connect(player);
      const wethAmount = 1000n;

      // First stake some WETH
      await wethToken.connect(owner).transfer(player.address, wethAmount);
      await wethToken
        .connect(player)
        .approve(await attributeMinter.getAddress(), wethAmount);
      await playerMinter.stakeAndMint(400, 300, 300);

      // Approve attribute tokens for burning
      await strengthToken
        .connect(player)
        .approve(await attributeMinter.getAddress(), 400);
      await intelligenceToken
        .connect(player)
        .approve(await attributeMinter.getAddress(), 300);
      await vitalityToken
        .connect(player)
        .approve(await attributeMinter.getAddress(), 300);

      // Withdraw WETH by burning attributes
      await expect(playerMinter.withdrawAndBurn(400, 300, 300))
        .to.emit(wethToken, "Transfer")
        .withArgs(await attributeMinter.getAddress(), player.address, 1);

      // Verify balances
      expect(await strengthToken.balanceOf(player.address)).to.equal(0);
      expect(await intelligenceToken.balanceOf(player.address)).to.equal(0);
      expect(await vitalityToken.balanceOf(player.address)).to.equal(0);
    });
  });
});
