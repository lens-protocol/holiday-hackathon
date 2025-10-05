import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  // IMPORTANT: Replace this with the actual KYC contract address before deployment
  const kycContractAddress = "0xYourKYCContractHere";

  // Deploy the upgraded ChallengeFactoryUpgraded
  const challengeFactoryUpgraded = await deployContract("ChallengeFactoryUpgraded", [], {
    hre,
    wallet,
    verify: true,
  });

  // Call the initialize function with the KYC contract
  const tx = await challengeFactoryUpgraded.initialize(kycContractAddress);
  await tx.wait();

  console.log("ChallengeFactoryUpgraded deployed at:", challengeFactoryUpgraded.address);
}
