import { ethers } from "hardhat";

async function deployBuzzFi() {
  const CONTRACT_NAME = "WinfinityStaking";
  const tokenAddress = "0xC49e12AF64Bc42223103464f655Fd315FdeAc23e";
  const startAmount = 0;
  const endAmount= ethers.parseEther("1000000");

  const winfinity = await ethers.deployContract(CONTRACT_NAME, [
    tokenAddress,
    tokenAddress,
    startAmount,
    endAmount,
    endAmount
  ]);
  await winfinity.waitForDeployment();
  console.log(
    "Deployed Winfinity contract address:",
    await winfinity.getAddress()
  );
}

async function main() {
  await deployBuzzFi();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
