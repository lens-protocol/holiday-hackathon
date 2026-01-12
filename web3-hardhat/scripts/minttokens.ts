import { ethers } from "hardhat";

async function mintTokens() {
  const ERC20_CONTRACT_NAME = "USDC";
  const TokenAddress = "0xC49e12AF64Bc42223103464f655Fd315FdeAc23e";
  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as any,
    ethers.provider
  );
  console.log("Deployer address:", sender.address);
  console.log("Minting Tokens...");
  const myERC20Contract = await ethers.getContractAt(
    ERC20_CONTRACT_NAME,
    TokenAddress,
    sender
  );
  const amount = ethers.parseEther("10000000");
  const tx = await myERC20Contract.mint(sender.address, amount);
  await tx.wait();
  console.log("Minted tokens:", tx.hash);
}

async function main() {
  await mintTokens();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
