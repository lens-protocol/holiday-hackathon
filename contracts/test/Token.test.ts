import { expect } from "chai";
import * as hre from "hardhat";
import { type Contract, type Wallet } from "zksync-ethers";
import { getWallet, LOCAL_RICH_WALLETS, deployContract } from "../deploy/utils";

describe("Token", function () {
  const owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey);

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const token = await deployContract("Token", [], {
        wallet: owner,
        silent: true,
      });

      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const token = await deployContract("Token", [], {
        wallet: owner,
        silent: true,
      });

      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    const recipient = getWallet(LOCAL_RICH_WALLETS[1].privateKey);

    let token: Contract;

    beforeEach(async function () {
      token = await deployContract("Token", [], {
        wallet: owner,
        silent: true,
      });
    });

    it("Should transfer tokens between accounts", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      await token.transfer(recipient.address, 50);

      expect(await token.balanceOf(owner.address)).to.equal(
        initialBalance - 50n
      );
      expect(await token.balanceOf(recipient.address)).to.equal(50);
    });

    it("Should emit Transfer events", async function () {
      await expect(token.transfer(recipient.address, 50))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, recipient.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const empty = token.connect(recipient) as Contract;

      await expect(empty.transfer(owner.address, 1)).to.be.revertedWith(
        "Not enough tokens"
      );
    });
  });
});
