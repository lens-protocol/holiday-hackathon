import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  // Deploy ChallengeFactory (upgradeable) with no constructor arguments
  const challengeFactory = await deployContract("ChallengeFactory", [], {
    hre,
    wallet,
    verify: true,
  });

  // Call the initialize() function on the newly deployed contract
  const tx = await challengeFactory.initialize();
  await tx.wait();

  console.log("ChallengeFactory deployed at:", challengeFactory.address);
}
