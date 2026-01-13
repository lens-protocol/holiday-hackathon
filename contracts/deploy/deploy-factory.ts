import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const wethAddress = "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8";

  await deployContract("AgentFactory", [wethAddress, process.env.GAME_MASTER], {
    hre,
    wallet,
    verify: true,
  });
}
