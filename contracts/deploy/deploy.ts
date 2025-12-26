import { deployContract } from "./utils";

// An example of a basic deploy script
// It will deploy a Ping contract to selected network
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const contractArtifactName = "lenscape";

  await deployContract(contractArtifactName);

  // if contract has constructor arguments
  // await deployContract (contractArtifactName, constructorArguments)
}
